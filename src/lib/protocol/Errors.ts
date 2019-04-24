import { ErrorResponse } from '../model/Error';

export const BAD_REQUEST_ERROR: ErrorResponse = {
  error_description: 'bad request for authorization server',
  error_type: 'invalid_request'
};

export const INVALID_STATE_ERROR: ErrorResponse = {
  error_description: 'unknown state',
  error_type: 'invalid_request'
};
