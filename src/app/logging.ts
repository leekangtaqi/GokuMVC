var log4js = require('log4js');
var util = require('util');
log4js.configure(__dirname + '/logging.json', { reloadSecs: 0 });
var applogger = log4js.getLogger('app');

export = {
    logger: applogger,
    generatorFunc:(next)=>{
        applogger.setLevel('DEBUG');
        var DEFAULT = "%s %s -- %s %s HTTP/%s, %s %s";
        var req = this.request, header = req.header, nodeReq = this.req;
        var str = util.format(DEFAULT, new Date().toLocaleString(), req.ip, req.method, req.url, nodeReq.httpVersion, req.length || null, header['user-agent']);
        applogger.debug(str);
        next();
    }
};
