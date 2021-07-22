/* eslint-disable sort-class-members/sort-class-members */
import { body, query, ValidationChain } from 'express-validator';
import { Moment } from 'moment-timezone';
import { Container, Service } from 'typedi';

@Service()
class ValidationChains {
  qTimeString = (paramKey: string): ValidationChain =>
    query(paramKey).isISO8601().withMessage('Must be in ISO8601 format');

  qTimeStringRange = (
    lowerParamKey: string,
    upperParamKey: string,
    maxIntervalInDay: number,
  ): ValidationChain[] => [
    this.qTimeString(lowerParamKey),
    this.qTimeString(upperParamKey)
      .custom((dateTimeMoment: Moment, { req }: any) =>
        dateTimeMoment.isAfter(req.query[`${lowerParamKey}`]),
      )
      .withMessage(`Must be after ${lowerParamKey}`)
      .custom((dateTimeMoment: Moment, { req }: any) =>
        dateTimeMoment
          .add(maxIntervalInDay + 1, 'days')
          .isAfter(req.query[`${lowerParamKey}`]),
      )
      .withMessage(
        `Must be at most ${maxIntervalInDay} days after ${lowerParamKey}`,
      ),
  ];

  bPassword = (key: string): ValidationChain =>
    body(key)
      .isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        'Must be at least 8 characters long, contain at least 1 uppercase, lowercase, number, and special characters',
      );
}

export default Container.get(ValidationChains);
