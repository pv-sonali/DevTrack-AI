import express from 'express';

export const generateCareerAdvice = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    
    if (!process.env.AI_API_KEY) {
      return res.status(503).json({ 
        message: 'AI Assistant is currently unavailable. Please configure the AI API Key.',
        mock: true,
        advice: 'This is a mock response because the AI API key is not configured. Remember to tailor your resume to the specific job description and practice your behavioral interview questions.'
      });
    }

    // Example structure for an LLM API call:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    return res.status(200).json({ advice: data.choices[0].message.content });
    */

    // For now, simulate a generic AI response if key is present but no specific provider is set up
    res.status(200).json({
      message: 'AI request successful',
      advice: `Based on your request "${prompt}", here is some AI-generated advice: Keep your resume concise, focus on impact and metrics, and ensure your GitHub portfolio is up to date.`
    });
  } catch (error) {
    next(error);
  }
};
