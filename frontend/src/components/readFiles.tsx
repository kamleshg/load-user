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
    <table>
      <tr>
        <th>Top3</th>
        <th>Languages_Known</th>
        <th>Position</th>
      </tr>

      {resumes.data.map((resume) => (
        <tr>
          <td>
            <ul>
              <li>{resume.data.answer.Top_3_Skills[0]}</li>
              <li>{resume.data.answer.Top_3_Skills[1]}</li>
              <li>{resume.data.answer.Top_3_Skills[2]}</li>
            </ul>
          </td>
          <td>
            <ul>
              <li>{resume.data.answer.Languages_Known[0]}</li>
              <li>{resume.data.answer.Languages_Known[1]}</li>
              <li>{resume.data.answer.Languages_Known[2]}</li>
            </ul>
          </td>
          <td>
            {resume.data.answer.Roles[0].Position}
          </td>
        </tr>
      ))}
  </table>
    
  );
}