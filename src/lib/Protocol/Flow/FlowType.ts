import { Api } from '~lib/Api';
import { Persistence } from '~lib/Persistence';
import { AuthenticationFlow } from './AuthenticationFlow';
import { CodePKCEFlow } from './CodePKCEFlow';
import { ImplicitFlow } from './ImplicitFlow';

type FlowType = 'IMPLICIT' | 'CODE_WITH_PKCE';

const parseFlow = (
  flow: FlowType,
  api: Api,
  persistence: Persistence
): AuthenticationFlow => {
  switch (flow) {
    case 'CODE_WITH_PKCE':
      return new CodePKCEFlow(api, persistence);
    case 'IMPLICIT':
    default:
      return new ImplicitFlow(api);
  }
};

export { FlowType, parseFlow };
