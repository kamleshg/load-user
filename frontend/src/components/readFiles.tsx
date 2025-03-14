import { useCollection, useQuery } from '@squidcloud/react';


export default function ReadFiles() {
  type User = { id: string; email: string; age: number };
  type Resume = {prompt: string; answer: string };
  
  const collection = useCollection<Resume>('resume');
  /** The list of users will be streamed to the client and kept up-to-date */
  const resumes = useQuery(collection.query());

  return (
    <ul style={{ listStyle: 'none', paddingLeft: '0px' }}>
      {resumes.data.map((resume) => (
        <li>
          {resume.data.answer}
        </li>
      ))}
    </ul>
  );
}