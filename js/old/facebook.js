function FacebookLogin(){
    
	FB.getLoginStatus(function(response) {
        
		if (response.status === 'connected') {
			accessToken = response.authResponse.accessToken;
			FB.api('/me', function(user) {
			 $("input[name=member_user]").val(user.id);
               $(".menber_user_id").val(user.id);
               if(checkout_form.valid()){
                    document.getElementById(parent_form).submit();
               }
               return true;
			});	
		} else if (response.status === 'not_authorized') {
			FB.login(function(responce) {
				if (responce.authResponse) {
					FB.api('/me', function(user) {
					   $("input[name=member_user]").val(user.id);
                        $(".menber_user_id").val(user.id);
                       if(checkout_form.valid()){
                            document.getElementById(parent_form).submit();
                       }
					});
				} else {
				    return false;
					// a dat cancel la acordare facebook permision
				}
			},{scope: customPermisions});
		} else {
			FB.login(function(responce) {
				if (responce.authResponse) {
					FB.api('/me', function(user) {
					   $("input[name=member_user]").val(user.id);
                       $(".menber_user_id").val(user.id);
                       if(checkout_form.valid()){
                            document.getElementById(parent_form).submit();
                       }
                       
					});
					
				} else {
				    return false;
				    // a dat cancel la facebook login
				}
			},{scope: customPermisions});
		}
	});
}
