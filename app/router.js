'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	require('./router/login')(app);
	require('./router/member')(app);
	require('./router/source')(app);
	require('./router/actionReg')(app);
	require('./router/vtcNji')(app);
	require('./router/ini')(app);
	require('./router/vtcCfgTemp')(app);
	require('./router/ats')(app);
	require('./router/tar')(app);
};
