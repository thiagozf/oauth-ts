export interface AuthorizeRequest {
  client_id: string;
  redirect_uri: string;
  response_type: 'code' | 'token';
  scope: string;
  code_challenge?: string;
  code_challenge_method?: string;
  prompt?: 'none' | 'login' | 'consent' | 'select_account';
  silent?: boolean;
  state?: string;
}
