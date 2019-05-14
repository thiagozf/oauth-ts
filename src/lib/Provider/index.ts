import { ErrorResponse, Result } from '~lib/Api';
import { authServerRequest } from '~lib/Api/AuthServerRequest';
import { OpenIDProvider, OpenIDProviderValidator } from './OpenIDProvider';

export const providerConfiguration = async (
  configurationEndpoint: string
): Promise<OpenIDProvider> => {
  const result: Result<OpenIDProvider, ErrorResponse> = await authServerRequest(
    {
      url: configurationEndpoint,
      validator: OpenIDProviderValidator
    }
  );

  return result.success ? Promise.resolve(result.value) : Promise.reject();
};

export * from './OpenIDProvider';
