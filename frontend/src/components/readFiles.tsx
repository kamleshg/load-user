import { useCollection, useQuery } from '@squidcloud/react';
import { Squid } from '@squidcloud/client';
import { useState, useEffect } from "react";

export default function ReadUsers() {

  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
    
  useEffect(
    () => {
    const getUser = async () => {
      try {
        const squid = new Squid({ appId: 'qv5qz2aob5iv8jvupo', region: 'us-east-1.aws', environmentId: 'dev', squidDeveloperId: 'dktqzx4wc4i243s7s7' });
        const contents = await squid.storage().listDirectoryContents('resumes');
        contents.files.forEach((element) => console.log(element));
        return contents.files
      } catch (err) {
        console.log("LS-ERR: " + err);
      }
    };
    getUser();
  }, []);

  return (
    <></>
  );
}