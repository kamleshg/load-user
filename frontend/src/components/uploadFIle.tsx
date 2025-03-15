import { Squid } from '@squidcloud/client';
import { useState, useEffect } from "react";


const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null; // Get the first selected file
    setSelectedFile(file);
  };

  const processFile = async (file: File) => {
    try {
      console.log("Processing file:", file.name);
      
      await storeFile(file);

      await requestSummary(file)
      
    } catch (err) {
      console.log("ERROR: " + err)
    }
  };

  const storeFile = async (file: File): Promise<File> => {
    const squid = new Squid({ appId: 'qv5qz2aob5iv8jvupo', region: 'us-east-1.aws', environmentId: 'dev', squidDeveloperId: 'dktqzx4wc4i243s7s7' });
    squid.storage(); // accesses the built-in storage bucket
    await squid.storage().uploadFile('resumes', file);
    return file;
  };
  

  const requestSummary = async (file: File) => {
    setLoading(true);
    try {
      await new Promise(f => setTimeout(f, 1000));

      const res = await fetch("https://qv5qz2aob5iv8jvupo-dev-dktqzx4wc4i243s7s7.us-east-1.aws.squid.cloud/webhooks/extractFile", {
        method: "GET"
      });

      if (!res.ok) 
        throw new Error(`HTTP error! Status: ${res.status}`);

      const result = await res.json();
      console.log("result:  " + result);
      
      setResponse(result.appId);
      
    } catch (error) {
      console.error("Error posting data:", error);
      setResponse("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".txt,.pdf,.jpg" />
      <button
        onClick={() => selectedFile && processFile(selectedFile)}
        disabled={!selectedFile}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      {/* {selectedFile && <p>Selected File: {selectedFile.name}</p>} */}
      {response && <blockquote>{response}</blockquote>}
    </div>
  );
};

export default UploadFile;
