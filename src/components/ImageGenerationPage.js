import React, { useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import './ImageGenerationPage.css';
import Header from './Header';
import Footer from './Footer';

const ImageGenerationPage = () => {
  const [inputTexts, setInputTexts] = useState(Array(10).fill(''));
  const [generatedImages, setGeneratedImages] = useState(Array(10).fill(''));
  const [loading, setLoading] = useState(false); // State to track loading status

  const handleGenerateImages = async () => {
    try {
      setLoading(true); // Set loading to true when starting image generation

      const imageRequests = inputTexts.map(async (text) => {
        if (!text.trim()) {
          return null;
        }

        const response = await fetch(
          "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
          {
            headers: {
              "Accept": "image/png",
              "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
              "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ "inputs": text }),
          }
        );

        const result = await response.blob();
        return { imageUrl: URL.createObjectURL(result), text };
      });

      const images = await Promise.all(imageRequests);
      setGeneratedImages(images);
    } catch (error) {
      console.error('Error generating images:', error.message);
      // Handle errors
    } finally {
      setLoading(false); // Set loading to false when image generation is complete
    }
  };

  const handleDownloadComic = async () => {
    if (generatedImages.some((imageInfo) => imageInfo && imageInfo.imageUrl)) {
      const zip = new JSZip();
  
      // Add text to images and convert to PDF
      const pdf = new jsPDF();
  
      for (let index = 0; index < generatedImages.length; index++) {
        const imageInfo = generatedImages[index];
  
        if (imageInfo && imageInfo.imageUrl) {
          const blob = await fetch(imageInfo.imageUrl).then((response) => response.blob());
  
          // Create a new page for each image
          if (index !== 0) {
            pdf.addPage();
          }
  
          // Draw image on PDF
          const imageData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
  
          pdf.addImage(imageData, 'PNG', 10, 10, 90, 120);
  
          // Draw text on PDF
          const textX = 110;
          const textY = 140;
          const maxWidth = 80;
          const lineHeight = 8;
          const lines = pdf.splitTextToSize(imageInfo.text, maxWidth);
  
          pdf.text(textX, textY, lines);
        }
      }
  
      // Save PDF
      const pdfBlob = pdf.output('blob');
      zip.file('comic.pdf', pdfBlob);
      zip.generateAsync({ type: 'blob' }).then((zipBlob) => {
        saveAs(zipBlob, 'comic.zip');
      });
    }
  };
  

  return (
    <div className="ImageGenerationPage">
      <Header />

      <main>
        {inputTexts.map((text, index) => (
          <div key={index}>
            <textarea
              placeholder={`Enter text for panel ${index + 1}...`}
              value={text}
              onChange={(e) => {
                const newTexts = [...inputTexts];
                newTexts[index] = e.target.value;
                setInputTexts(newTexts);
              }}
            />
          </div>
        ))}

        <button onClick={handleGenerateImages}>Generate Comic</button>

        {loading ? (
          <div className="loader-container">
            <TailSpin type="Oval" color="#4CAF50" height={50} width={50} />
          </div>
        ) : (
          <div className="generated-images">
            {generatedImages.map((imageInfo, index) => (
              <div key={index} className="generated-image">
                {imageInfo && imageInfo.imageUrl && (
                  <div className="comic-panel">
                    <div className="text-bubble">
                      {imageInfo.text && <p>{imageInfo.text}</p>}
                    </div>
                    <img  src={imageInfo.imageUrl} alt={`Generated Comic Panel ${index + 1}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {generatedImages.some((imageInfo) => imageInfo && imageInfo.imageUrl) && (
          <button onClick={handleDownloadComic}>Download Comic</button>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ImageGenerationPage;
