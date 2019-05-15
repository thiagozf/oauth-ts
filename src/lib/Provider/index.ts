import { ErrorResponse } from '~lib/Api';
import { authServerRequest } from '~lib/Api/AuthServerRequest';
import { Result } from '~lib/Result';
import { OpenIDProvider, OpenIDProviderValidator } from './OpenIDProvider';

export const resolveProvider = async (
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
