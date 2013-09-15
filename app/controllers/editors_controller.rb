require "dropbox_sdk"
require "open-uri"
require 'net/http'
RootCA = '/etc/ssl/certs'
class EditorsController < ApplicationController

def index
if(params.has_key?(:file_link))
  @url = URI.parse params[:file_link].gsub(" ","_")
  puts "$$$" * 100
  puts @url
  http = Net::HTTP.new(@url.host, @url.port)
  http.use_ssl = (@url.scheme == 'https')
  if (File.directory?(RootCA) && http.use_ssl?)
   http.ca_path = RootCA
   http.verify_mode = OpenSSL::SSL::VERIFY_PEER
   http.verify_depth = 5
  else
   http.verify_mode = OpenSSL::SSL::VERIFY_NONE 
  end
  request = Net::HTTP::Get.new(@url.path)
  request.basic_auth @url.user, @url.password
  response = http.request(request)
  @body = response.body.to_s
  puts @body.gsub!(/(\n)|(\r)/, "").inspect
  puts @body.gsub!(/(")/, "'").inspect
else
	@body = params[:data]
end
  get_files
  end

def update 
	content = params[:content]
	location = params[:location]
	puts "$$$" * 100
	puts @url
	dbsession = DropboxSession.new(ENV["DROPBOX_KEY"], ENV["DROPBOX_SECRET"])
	dbsession.set_access_token(current_user.access_token,current_user.secret_token);
	client = DropboxClient.new(dbsession, "dropbox")
	entries = client.put_file(path= location,content,true)
	# entries = @client.put_file(path= folder_path + '/' + 'index.html',"<html></html>")


end
def get_files
  path_file = params["path"].blank? ? "/" : params["path"];
  puts "$$$$$$$$"
  puts path_file
	dbsession = DropboxSession.new(ENV["DROPBOX_KEY"], ENV["DROPBOX_SECRET"])
	dbsession.set_access_token(current_user.access_token,current_user.secret_token);
	client = DropboxClient.new(dbsession, "dropbox")
	# puts client.account_info.inspect
	entries = client.metadata(path=path_file,file_limit=100,list=true)
	contents = entries["contents"]
	@file_names = []
	contents.each { |a| @file_names << a['path'] }
	session.delete :dropbox_session
	flash[:success] = "You have successfully authorized with dropbox."
  respond_to do |format|
    format.html {}
    format.json {render :json=>  @file_names.to_json}
  end
end

def get_file_content
  dbsession = DropboxSession.new(ENV["DROPBOX_KEY"], ENV["DROPBOX_SECRET"])
  dbsession.set_access_token(current_user.access_token,current_user.secret_token);
  client = DropboxClient.new(dbsession, "dropbox")
  file_path = params["file_path"]
  contents, metadata = client.get_file_and_metadata(file_path)
  render :json => contents.to_json
end

def to_s
  attributes.each_with_object("") do |attribute, result|
    result << "#{attribute[1].to_s} "
  end
end
end
