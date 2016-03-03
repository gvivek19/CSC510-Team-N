import functools
import cyclone.web
from twisted.internet import defer
import json
import pwd
import grp
import os



def HTTPBasic(method):
    @functools.wraps(method)
    @defer.inlineCallbacks
    def wrapper(self, *args, **kwargs):
    	user_id = self.get_argument('_id', None)
        if not user_id:
            raise cyclone.web.HTTPAuthenticationRequired()
        self.user = yield self.database.get_user_by_id(user_id)
        result = yield defer.maybeDeferred(method, self, *args, **kwargs)
        defer.returnValue(result)
    return wrapper


class FileUploadMixin(object):
    def _get_gid(self, gname):
        try:
            return grp.getgrnam(gname).gr_gid
        except KeyError:
            try:
                return grp.getgrnam('root').gr_gid
            except KeyError:
                return os.getgid()

    def _get_uid(self, uname):
        try:
            return pwd.getpwnam(uname).pw_uid
        except KeyError:
            return pwd.getpwuid(os.getuid()).pw_uid

    def _chown(self, fname):
        try:
            uid = self._get_uid('gautam')
            gid = self._get_gid('www-data')
            os.chown(fname, uid, gid)
            return True
        except:
            log.msg("_chown operation not permitted, exceptions.OSError")

    def save_file(self, folder_name, file_id):
    	data_file = None
    	if 'files' in self.request.files:
            data_file = self.request.files[u'files'][0]
        else:
            data_file = self.request.files['Filedata'][0]

        upload_dir = os.path.join("uploads", folder_name, str(file_id))

        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir, 0755)
            self._chown(upload_dir)
        filename = data_file.filename.encode('utf-8').lower()
        fn, ext = os.path.splitext(filename)
        ext = ext.lower()
        cnt = 1
        filename = str(cnt) + ext
        while os.path.exists(os.path.join(upload_dir, filename)):
            cnt += 1
            filename = str(cnt) + ext
        file_path = os.path.join(upload_dir, filename)
        with open(file_path, 'wb') as f:
            f.write(data_file['body'])
        self._chown(file_path)
        file_size = os.path.getsize(file_path)
        file_path = "/" + file_path
        return file_path, file_size, ext