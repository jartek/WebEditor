require 'dropbox_sdk'
class DropboxController < ApplicationController
 
# @Params : None
# @Return : None
# @Purpose : To create new dropbox session for authorization
DROPBOX_APP_KEY = "fsxjf8w5xuplukj"
DROPBOX_APP_KEY_SECRET = "ltat6rbd4o9ky66"
DROPBOX_APP_MODE = "dropbox"
def authorize
 
dbsession = DropboxSession.new(DROPBOX_APP_KEY, DROPBOX_APP_KEY_SECRET)
#serialize and save this DropboxSession
session[:dropbox_session] = dbsession.serialize
#pass to get_authorize_url a callback url that will return the user here
redirect_to dbsession.get_authorize_url url_for(:action => 'dropbox_callback')
 
end
 
# @Params : None
# @Return : None
# @Purpose : To callback for dropbox authorization
def dropbox_callback
 
dbsession = DropboxSession.deserialize(session[:dropbox_session])
dbsession.get_access_token #we've been authorized, so now request an access_token
session[:dropbox_session] = dbsession.serialize
#current_user.update_attributes(:dropbox_session => session[:dropbox_session])
client = DropboxClient.new(dbsession, DROPBOX_APP_MODE)
puts "*"*100
#puts client.metadata('/',100,null,true,null)

session.delete :dropbox_session
flash[:success] = "You have successfully authorized with dropbox."

redirect_to 'home#index'
 
end # end of dropbox_callback action
 
end # end of class
 
# Now we are ready to do any thing that is possible with dropbox(eg:- upload ,  download ).
 
# Lets try to upload a file to dropbox the code for it is below
# dbsession = DropboxSession.deserialize(current_user.dropbox_session)
# # create the dropbox client object
# client = DropboxClient.new(dbsession, DROPBOX_APP_MODE)
# data = File.read("/path/to/test.png")
# client.put_file("test.png",data)
