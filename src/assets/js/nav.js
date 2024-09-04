(function($) {
	var	$window = $(window),
		$body = $('body');
		    // Encapsuler le code dans une fonction
            function initializeNavPanel() {
                $(
                    '<div id="navPanel">' +
                        '<nav>' +
                            $('#nav').navList() +
                        '</nav>' +
                    '</div>'
                )
                    .appendTo($body)
                    .panel({
                        delay: 500,
                        hideOnClick: true,
                        hideOnSwipe: true,
                        resetScroll: true,
                        resetForms: true,
                        side: 'left',
                        target: $body,
                        visibleClass: 'navPanel-visible'
                    });
            }
            // Exporter la fonction vers l'espace global
            window.initializeNavPanel = initializeNavPanel;

            function deconnexion(){
                var logoutLink = $("#navPanel a").get(2); // Récupération du lien
                var $logoutLink = $(logoutLink);          // Convertion en objet JQuery

                if($logoutLink.text().trim() === 'Déconnexion'){
                    $logoutLink.on('click', function(e) {
                        e.preventDefault(); // Empêche le comportement par défaut du lien
                        if (typeof window.logout === 'function') {
                            window.logout();
                        }else {
                            console.log("logout function is not defined");
                        }
                    });
                };
            }

            window.deconnexion = deconnexion;


})(jQuery);