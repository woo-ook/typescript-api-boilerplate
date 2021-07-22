// import ValidationChains from '@/middlewares/ValidationChains';
import Validator from '@/middlewares/Validator';

class TokensValidator {
  static credentials = Validator.validate([
    // check if username exists in the database
  ]);
}

export default TokensValidator;
