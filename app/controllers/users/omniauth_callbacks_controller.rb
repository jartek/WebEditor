class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def dropbox
    @user = User.find_for_dropbox_oauth(request.env["omniauth.auth"], current_user)

    if @user.persisted?
      puts "&"*100
      puts request.env["omniauth.auth"]
      sign_in_and_redirect @user, :event => :authentication
      set_flash_message(:notice, :success, :kind => "dropbox") if is_navigational_format?
    else
      session["devise.dropbox_data"] = request.env["omniauth.auth"].except("extra")
      puts "&"*100
      puts request.env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
    auth_hash = request.env['omniauth.auth']
    access_token = auth_hash[:extra][:access_token]
  end
end
