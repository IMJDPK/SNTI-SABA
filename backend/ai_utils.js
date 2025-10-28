const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const fs = require('fs');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function extractPdfContent(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting PDF content:', error);
        throw new Error('Failed to extract PDF content');
    }
}

async function trainGeminiWithPdf(pdfContent) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // Break content into manageable chunks if needed (e.g., 30k chars)
        const chunkSize = 30000;
        const chunks = [];
        
        for (let i = 0; i < pdfContent.length; i += chunkSize) {
            chunks.push(pdfContent.slice(i, i + chunkSize));
        }

        // Process each chunk
        const responses = [];
        for (const chunk of chunks) {
            const prompt = `Please process and understand the following content for training purposes:\n\n${chunk}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            responses.push(response.text());
        }

        return {
            success: true,
            message: 'PDF content successfully processed by Gemini',
            responses
        };
    } catch (error) {
        console.error('Error training Gemini with PDF:', error);
        throw new Error('Failed to process PDF content with Gemini');
    }
}

module.exports = {
    extractPdfContent,
    trainGeminiWithPdf
};
