const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const axios = require('axios');

// Basic Matching Logic
router.post('/match', async (req, res) => {
  try {
    const { requiredSkills, preferredSkills, minExperience } = req.body;
    
    // Validate required fields
    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ error: 'requiredSkills array is required' });
    }

    const candidates = await Candidate.find();
    
    const reqSkillsLower = requiredSkills.map(s => s.toLowerCase().trim());
    const prefSkillsLower = (preferredSkills || []).map(s => s.toLowerCase().trim());
    const minExp = minExperience ? Number(minExperience) : 0;

    const matchedCandidates = candidates.map(candidate => {
      let matchScore = 0;
      let totalWeight = reqSkillsLower.length * 2 + prefSkillsLower.length;
      
      if (totalWeight === 0) totalWeight = 1; // avoid division by zero

      const candidateSkillsLower = candidate.skills.map(s => s.toLowerCase().trim());

      // Score required skills (weight 2)
      let reqMatched = 0;
      reqSkillsLower.forEach(skill => {
        if (candidateSkillsLower.includes(skill)) {
          matchScore += 2;
          reqMatched += 1;
        }
      });

      // Score preferred skills (weight 1)
      let prefMatched = 0;
      prefSkillsLower.forEach(skill => {
        if (candidateSkillsLower.includes(skill)) {
          matchScore += 1;
          prefMatched += 1;
        }
      });

      let percentage = (matchScore / totalWeight) * 100;
      
      // Penalize heavily if min experience is not met
      if (candidate.experience < minExp) {
        percentage -= 30; // Deduct 30% penalty
      }
      
      // Ensure percentage is between 0 and 100
      percentage = Math.max(0, Math.min(100, Math.round(percentage)));

      let category = 'Low Match';
      if (percentage >= 75) category = 'High Match';
      else if (percentage >= 50) category = 'Medium Match';

      return {
        ...candidate.toObject(),
        matchPercentage: percentage,
        matchCategory: category,
        reqMatchedCount: reqMatched,
        reqTotalCount: reqSkillsLower.length
      };
    });

    // Sort by percentage descending
    matchedCandidates.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json(matchedCandidates);
  } catch (error) {
    console.error('Error in basic matching:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI Shortlisting Logic using OpenRouter
router.post('/ai/shortlist', async (req, res) => {
  try {
    const { jobDescription, requiredSkills, minExperience } = req.body;
    
    const candidates = await Candidate.find();
    
    if (!candidates || candidates.length === 0) {
      return res.status(400).json({ error: 'No candidates available to shortlist.' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OpenRouter API key is missing.' });
    }

    // Prepare data for AI
    const candidatesData = candidates.map(c => ({
      id: c._id,
      name: c.name,
      skills: c.skills.join(', '),
      experience: c.experience,
      bio: c.bio,
      projects: c.projects
    }));

    const prompt = `
      You are an expert HR Technical Recruiter. I need you to analyze the following candidates and shortlist the top 3 best fits for the job requirement.
      
      Job Requirements:
      - Required Skills: ${requiredSkills ? requiredSkills.join(', ') : 'Not specified'}
      - Minimum Experience: ${minExperience || 0} years
      - Additional Details: ${jobDescription || 'Not specified'}

      Candidates:
      ${JSON.stringify(candidatesData, null, 2)}

      Please rank the best candidates and explain why each is suitable.
      Return the response in valid JSON format exactly like this, without any markdown formatting or \`\`\`json wrappers:
      [
        {
          "candidateId": "id here",
          "name": "name here",
          "rank": 1,
          "reasoning": "Detailed explanation of why they are a good fit...",
          "score": "A score out of 100"
        }
      ]
    `;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI recruiter assistant. Always return strictly valid JSON as requested.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:5173', // Your app URL
        'X-Title': 'Candidate Shortlisting System',
        'Content-Type': 'application/json'
      }
    });

    const aiContent = response.data.choices[0].message.content;
    
    // Parse the JSON. The model might still add markdown backticks despite instructions.
    let parsedResult;
    try {
      const cleanedContent = aiContent.replace(/^\`\`\`(json)?|\`\`\`$/g, '').trim();
      parsedResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      return res.status(500).json({ error: 'AI returned invalid JSON format.' });
    }

    res.json(parsedResult);
  } catch (error) {
    console.error('Error in AI shortlisting:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to process AI shortlisting.' });
  }
});

module.exports = router;
