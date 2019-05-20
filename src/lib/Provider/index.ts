import { authServerRequest } from '~lib/Api/AuthServerRequest';
import { OpenIDProvider, OpenIDProviderValidator } from './OpenIDProvider';

export const resolveProvider = async (
  configurationEndpoint: string
): Promise<OpenIDProvider> => {
  return authServerRequest({
    url: configurationEndpoint,
    validator: OpenIDProviderValidator
  });
};

export * from './OpenIDProvider';
