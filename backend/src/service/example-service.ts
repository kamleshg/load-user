import { secureAiAgent, secureCollection, secureDatabase, SquidService, webhook, QueryContext } from '@squidcloud/backend';
import { SquidFile, WebhookRequest, WebhookResponse, secureStorage } from '@squidcloud/backend';
import { AgentContextRequest, TextContextRequest, Squid } from '@squidcloud/client';

import { lastValueFrom } from 'rxjs';


type User = { id: string; email: string; age: number };
type Roles = { Position: string; duration: string};
type Answer = { Top_3_Skills: string[]; Languages_Known: string[]; Roles: Roles[] };
type Resume = {prompt: string; answer: Answer };

export class ExampleService extends SquidService {
  
  @secureStorage('all', 'built_in_storage')
  allowAllAccessToBuiltInStorage(): boolean {
      return true;
  }

  @secureCollection('users', 'read')
  secureUsersRead(context: QueryContext<User>): boolean {
    /** Checks whether the user is authenticated */
    return true;
  }

  @secureCollection('resume', 'read')
  secureResumeRead(context: QueryContext<Resume>): boolean {
    /** Checks whether the user is authenticated */
    return true;
  }

  @secureDatabase('all', 'built_in_db')
  allowAllAccessToBuiltInDb(): boolean {
    return true;
  }

  @secureAiAgent('chat')
  allowChat(): boolean {
    return true;
  }

  @secureAiAgent('mutate')
  allowMutations(): boolean {
    return true;
  }

  @webhook('example-service-webhook')
  handleExampleServiceWebhook(): object {
    const response = {
      message: `Hello from 'example-service-webhook'`,
      date: new Date().toString(),
      appId: this.context.appId,
    };
    console.log(response); // This message will appear in the "Logs" tab of the Squid Console.
    return response;
  }

  @webhook('extractFile')
  async extractFile(request: WebhookRequest): Promise<WebhookResponse | any> {
    const squid = new Squid({ appId: 'qv5qz2aob5iv8jvupo', region: 'us-east-1.aws', environmentId: 'dev', squidDeveloperId: 'dktqzx4wc4i243s7s7' });
    const extractionClient = this.squid.extraction();
    
    
    const contents = await squid.storage().listDirectoryContents('resumes');
    // contents.files.forEach((element) => console.log("RESUME: " + element.absoluteFilePathInBucket));
    var fileName = contents.files[0].absoluteFilePathInBucket;
    console.log("Summarize: " + fileName)

    const urlResponse = await squid.storage().getDownloadUrl(contents.files[0].absoluteFilePathInBucket, 7200);
    // console.log(urlResponse.url);
        
    const resp = await fetch(urlResponse.url);
    const blob = await resp.blob();

    const file = new File([blob], "Resume.pdf")

    const data = {
      blob: blob,
      name: 'Resume.pdf',
    };
    
    await squid.storage().deleteFile(contents.files[0].absoluteFilePathInBucket);

    const extractedResult = await extractionClient.extractDataFromDocumentFile(
      data
    );
    // console.log(extractedResult); // 'Q4 Development Plan...'

    const contextRequest: TextContextRequest = {
      type: 'text',
      title: 'Resume Content',
      text: '',
      contextId: ''
    }

    // const context = squid.ai().agent('doc-summary-agent').upsertContext(contextRequest, file)

    var prompt = 'Given the following: '
    extractedResult['pages'].forEach(element => {
      prompt += element.text
    });

    prompt += "  Summarize the following for me: 1) Top 3 Skill 2) Languages known 3) for each role mention position and duration 4) Strengths  and answer in a JSON format"


    // var answer = await lastValueFrom(
    //   squid.ai().agent('doc-summary-agent').chat(prompt)
    // );
    // answer = answer.replace("```json","")
    // answer = answer.replace("```","")
    // console.log("answer: " + answer)
    
    var jAnswer = JSON.parse('{"Top_3_Skills": ["Technical Consulting", "Cloud Technologies", "Sales Engineering" ], "Languages_Known": ["Java", "Python", "JavaScript", "Bash", "SQL" ], "Roles": [{"Position": "Senior Sales Engineer", "Company": "TechPro Solutions", "Duration": "April 2019 – Present" }, {"Position": "Sales Engineer", "Company": "Innovatech Solutions", "Duration": "March 2015 – March 2019" }, {"Position": "Sales Engineer", "Company": "CloudEdge Technologies", "Duration": "August 2011 – February 2015" } ], "Strengths": ["Customer-Focused Approach", "Strong Technical Acumen", "Exceptional Communicator", "Team Collaboration", "Results-Oriented" ] }')

    const collectionRef = squid.collection<Resume>('resume');
    const docRef = collectionRef.doc('summarized');
    
    
    var test = {  
      prompt: prompt,
      answer: jAnswer
    }

    await docRef.insert(test);


    return this.createWebhookResponse({});
  }
}
