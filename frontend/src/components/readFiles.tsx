import { useCollection, useQuery } from '@squidcloud/react';


export default function ReadFiles() {
  type User = { id: string; email: string; age: number };
  type Roles = { Position: string; duration: string};
  type Answer = { Top_3_Skills: string[]; Languages_Known: string[]; Roles: Roles[] };
  type Resume = {prompt: string; answer: Answer };
  
  const collection = useCollection<Resume>('resume');
  /** The list of users will be streamed to the client and kept up-to-date */
  const resumes = useQuery(collection.query());

  // console.log("Answer: " + JSON.stringify(resumes));

  return (
    <div>
      <h1>Summary</h1>
      {resumes.data.map((resume) => (
        <p>{resume.data.answer}</p>
      ))}
    </div>
    
  );
}