import { authServerRequest } from '~lib/Api/AuthServerRequest';
import { OpenIDProvider } from './OpenIDProvider';

export const resolveProvider = async (
  configurationEndpoint: string
): Promise<OpenIDProvider> => {
  return authServerRequest({ url: configurationEndpoint });
};

export * from './OpenIDProvider';
