export interface IntrospectResponse {
  client: {
    attributes: Record<string, any>;
    client_id: string;
    name: string;
  };
  expires_in: string;
  scopes: string;
  user: {
    attributes: Record<string, any>;
    id: string;
  };
}
