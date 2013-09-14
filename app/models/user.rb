class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  def self.find_for_dropbox_oauth(auth, signed_in_resource=nil)
    user = User.where(:provider => auth.provider, :uid => auth.uid).first
    unless user
      user = User.new
      user.name = auth.extra.raw_info.display_name
      user.provider = auth.provider
      user.uid = auth.uid
      user.email = auth.info.email
      user.password = Devise.friendly_token[0,20]
      user.save
    end
    user
  end

  def self.new_with_session(params, session)
     super.tap do |user|
       if data = session["devise.dropbox_data"] && session["devise.dropbox_data"]["extra"]["raw_info"]
         user.email = data["email"] if user.email.blank?
       end
     end
   end
end
