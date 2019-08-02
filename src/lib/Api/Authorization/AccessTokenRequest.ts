export interface AccessTokenRequest {
  client_id: string;
  grant_type: string;
  scope: string;
  client_secret?: string;
  code?: string;
  code_verifier?: string;
  redirect_uri?: string;
  refresh_token?: string;
}
