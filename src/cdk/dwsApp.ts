import { App } from '@aws-cdk/core';
import { dwsStack } from './dwsStack';

const app = new App();
new dwsStack(app, 'dws-stack',{
    env:{
        region: 'us-east-2',
        account: '313944524791'   
    }
});
