'use strict';

const sequelize = require('./_db').sequelize();
const Member = sequelize.import('./Member.js');

exports.Member = Member;
