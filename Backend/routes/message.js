const express = require('express');
const router = express.Router();
const Message = require('../model/Message'); // You'll need to create this model
const { checkSessionId } = require('../helper/Functions.js');

router.post('/send', async (req, res) => {
  try {
    await checkSessionId(req, req.body.senderId);

    const { senderId, recipientId, content } = req.body;
    
    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await newMessage.save();

    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
  }
});

module.exports = router;
