import { useCollection, useQuery } from '@squidcloud/react';
import { Squid } from '@squidcloud/client';
import { useEffect } from "react";

export default function ReadUsers() {

  
  useEffect(
    () => {
    const getUser = async () => {
      try {
        const squid = new Squid({ appId: 'qv5qz2aob5iv8jvupo', region: 'us-east-1.aws', environmentId: 'dev', squidDeveloperId: 'dktqzx4wc4i243s7s7' });
        const contents = await squid.storage().listDirectoryContents('resumes');
        contents.files.forEach((element) => console.log(element));
      } catch (err) {
        console.log("LS-ERR: " + err);
      }
    };
    getUser();
  }, []);

  return (
    <div>DOCS</div>
  );
}