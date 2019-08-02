export interface OpenIDProvider {
  authorization_endpoint: string;
  end_session_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  check_session_iframe?: string;
  introspect_endpoint?: string;
}
