export const sendMessageToGPT = async (message, model = 'gpt-4o-mini') => {
  try {

    const res = await fetch('https://ide-codegeniusbackend.onrender.com/api/gpt/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, model }),
    });

    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.error('GPT API Error:', err);
    return '⚠️ Failed to fetch reply from assistant.';
  }
};
