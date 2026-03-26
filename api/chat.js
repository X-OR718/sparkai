export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { messages } = req.body
  if (!messages) return res.status(400).json({ error: 'Messages required' })

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_KEY

  // Log key status (first 8 chars only for security)
  console.log('API Key present:', !!apiKey, apiKey ? apiKey.substring(0, 8) + '...' : 'MISSING')

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://sparkai-mu.vercel.app',
        'X-Title': 'SparkAI'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages,
        max_tokens: 400,
        temperature: 0.9
      })
    })

    const data = await openRouterRes.json()

    // Log full OpenRouter response for debugging
    console.log('OpenRouter status:', openRouterRes.status)
    console.log('OpenRouter response:', JSON.stringify(data))

    if (data.error) {
      console.log('OpenRouter error:', data.error)
      return res.status(500).json({ error: data.error.message || 'OpenRouter error' })
    }

    const text = data.choices?.[0]?.message?.content || ''
    if (!text) {
      console.log('No text in response:', JSON.stringify(data))
      return res.status(500).json({ error: 'Empty response from model' })
    }

    return res.status(200).json({ text })

  } catch (err) {
    console.log('Fetch error:', err.message)
    return res.status(500).json({ error: 'API call failed: ' + err.message })
  }
}
