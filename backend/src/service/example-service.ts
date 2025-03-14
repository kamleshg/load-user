import { secureAiAgent, secureCollection, secureDatabase, SquidService, webhook, QueryContext } from '@squidcloud/backend';
import { SquidFile, WebhookRequest, WebhookResponse, secureStorage } from '@squidcloud/backend';
import { AgentContextRequest, TextContextRequest, Squid } from '@squidcloud/client';
import { lastValueFrom } from 'rxjs';


type User = { id: string; email: string; age: number };

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
  async handleStripePayment(request: WebhookRequest): Promise<WebhookResponse | any> {
    const squid = new Squid({ appId: 'qv5qz2aob5iv8jvupo', region: 'us-east-1.aws', environmentId: 'dev', squidDeveloperId: 'dktqzx4wc4i243s7s7' });
    const extractionClient = this.squid.extraction();
    
    
    // const contents = await squid.storage().listDirectoryContents('resumes');
    // contents.files.forEach((element) => console.log(element));

    const urlResponse = await squid.storage().getDownloadUrl('resumes/Kamlesh Gokal.pdf', 7200);
    console.log(urlResponse.url);
        
    const resp = await fetch(urlResponse.url);
    const blob = await resp.blob();

    console.log(blob)
    
    const file = new File([blob], "Kamlesh Gokal.pdf")

    const data = {
      blob: blob,
      name: 'Kamlesh Gokal.pdf',
    };
    
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

    prompt += "  Summarize the following for me: 1) Top 3 Skill 2) Languages known 3) for each role mention position and duration 4) Strengths"


    // const answer = await lastValueFrom(
    //   squid.ai().agent('doc-summary-agent').chat(prompt)
    // );
    
    var response = {
     prompt: prompt,
     answer: 'Well the answer is hes awesome!'
    }

    console.log("response: " + response)

    return this.createWebhookResponse(JSON.stringify(response));
  }
}
