// Namespace
// De code wordt in een object gezet. Om conflicten met andere ingeladen js tegen te gaan waar zelfde namen worden gebruikt.
var favMovies = favMovies || {};

// Self Invoking Anomymous Function
// Alles wat in deze functie gebeurd is afgeschermd van andere code. Er kunnen geen conflicten ontstaan met ingeladen andere code.
(function () {

    // Controller object roept andere objecten aan die gelijk uitgevoerd worden.
    favMovies.controller = {
        init: function() {
            favMovies.section.init();
            favMovies.router.init();
            favMovies.swipeEffect.init();
            favMovies.config.init();
        }
    };

    // Router object 
    // Kijkt naar de URL en voert op basis daar van objecten uit.
    favMovies.router = {
        init: function() {
            routie({
                // Als er in de URL #about staat wordt de section.toggle method uitgevoerd met de parameter about.
                'about': function() {
                    favMovies.section.toggle('about');
                },
                'movies': function() {
                    // favMovies.section.toggle('loading');
                    // Delay ingevoegd om spinner te laten zien.
                    favMovies.section.movies();
                    favMovies.section.toggle('loading');
                    setTimeout(function() {
                        favMovies.section.toggle('movieWrapper');
                    }, 1000);
                },
                'movies/:order': function(order) {
                    // favMovies.section.toggle('loading');
                    // Delay ingevoegd om spinner te laten zien.
                    favMovies.section.movies(order);
                    favMovies.section.toggle('movieWrapper');
                },
                'movie/:id': function(id) {
                    // Bij de detailpagina wordt de id uit de URL gehaald en doorgegeven aan de movie method.
                    // Zo wordt de juiste data van de film geladen ipv alle films.
                    favMovies.config.jsonpData(id);
                    favMovies.section.toggle('loading');
                    setTimeout(function() {
                        favMovies.section.toggle('movie');
                    }, 1000);
                },
                '*': function() {
                    // Standaard pagina wordt geladen als er niks achter de URL staat.
                    favMovies.section.movies();
                    favMovies.section.toggle('home');
                }
            });
        }
    };

    // Content object voor de about pagina.
    favMovies.movieContent = {
        about: {
            titel: 'About this app',
            aboutDescription: "<p>Cities fall but they are rebuilt. Heroes die but they are remembered. the man likes to play chess; let's get him some rocks. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. bruce... i'm god. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all. rehabilitated? well, now let me see. you know, i don't have any idea what that means. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. rehabilitated? well, now let me see. you know, i don't have any idea what that means. cities fall but they are rebuilt. heroes die but they are remembered. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all.</p><p>I did the same thing to gandhi, he didn't eat for three weeks. bruce... i'm god. cities fall but they are rebuilt. heroes die but they are remembered. i once heard a wise man say there are no perfect men. only perfect intentions. cities fall but they are rebuilt. heroes die but they are remembered. boxing is about respect. getting it for yourself, and taking it away from the other guy. well, what is it today? more spelunking?</p><p>let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. bruce... i'm god. well, what is it today? more spelunking? it only took me six days. same time it took the lord to make the world. i did the same thing to gandhi, he didn't eat for three weeks. Let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. boxing is about respect. getting it for yourself, and taking it away from the other guy. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. you measure yourself by the people who measure themselves by you. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. you measure yourself by the people who measure themselves by you. you measure yourself by the people who measure themselves by you.</p><p>that tall drink of water with the silver spoon up his ass. i once heard a wise man say there are no perfect men. only perfect intentions. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. boxing is about respect. getting it for yourself, and taking it away from the other guy. That tall drink of water with the silver spoon up his ass. well, what is it today? more spelunking? i now issue a new commandment: thou shalt do the dance. let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. i did the same thing to gandhi, he didn't eat for three weeks. the man likes to play chess; let's get him some rocks. i now issue a new commandment: thou shalt do the dance. i now issue a new commandment: thou shalt do the dance. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. i don't think they tried to market it to the billionaire, spelunking, base-jumping crowd. that tall drink of water with the silver spoon up his ass. it only took me six days. same time it took the lord to make the world.</p>"
        }
    };

    // Sections Object
    // Met Transparency.js wordt content in de html geladen.
    favMovies.section = {
        init: function() {
            this.about();
            this.movies();
            this.startscreen();
        },
        about: function() {
            // Transparency pakt de content, haalt het door de directives en zoekt het ID op de pagina en zet de juiste content daar.
            Transparency.render(document.getElementById('about'), favMovies.movieContent.about, favMovies.config.directives);
        },
        movies: function(order) {
             if(localStorage.getItem('movies')) {
                var movieData = JSON.parse(localStorage.getItem('movies'));
                var goodData = movieData.items;
                if (order) {
                    if (order === "ratingdesc") {
                        goodData = _.sortBy(movieData.items, function(movie) {
                            return movie.vote_average * -1;
                        });
                    } else if (order === "ratingasc") {
                        goodData = _.sortBy(movieData.items, function(movie) {
                            return movie.vote_average;
                        });
                    } else if (order === "name") {
                        goodData = _.sortBy(movieData.items, function(movie) {
                            return movie.title;
                        });
                    } else if (order === "popularity") {
                        goodData = _.sortBy(movieData.items, function(movie) {
                            return movie.popularity * -1;
                        });
                    }
                };

                Transparency.render(document.getElementById('movieContent'), goodData, favMovies.config.directives); 
            } else {
                // Als er geen localstorage is wordt er met de API data opgehaald.
                favMovies.config.xhr('GET', 'http://api.themoviedb.org/3/list/5454b8dbc3a3681478003cf7?api_key=56506e6256a280dcd69573fa48f1f3fd', function(response) { 
                    // De response van de request wordt eerst gemanipuleerd en daar in de localStorage gezet.
                    favMovies.config.manipulateData(response);
                    // Data wordt weer opgehaald uit de localstorage.
                    var movieData = JSON.parse(localStorage.getItem('movies'));
                    var goodData = movieData.items;
                    if (order) {
                        if (order === "ratingdesc") {
                            goodData = _.sortBy(movieData.items, function(movie) {
                                return movie.vote_average * -1;
                            });
                        } else if (order === "ratingasc") {
                            goodData = _.sortBy(movieData.items, function(movie) {
                                return movie.vote_average;
                            });
                        } else if (order === "name") {
                            goodData = _.sortBy(movieData.items, function(movie) {
                                return movie.title;
                            });
                        } else if (order === "popularity") {
                            goodData = _.sortBy(movieData.items, function(movie) {
                                return movie.popularity * -1;
                            });
                        };
                    };

                    Transparency.render(document.getElementById('movieContent'), goodData, favMovies.config.directives); 
                });
            }
        },
        movie: function(data) {
            var movieData = data;
            console.log(movieData);
            Transparency.render(document.getElementById('movie'), movieData, favMovies.config.directives);
            
        },
        startscreen: function() {
            if(localStorage.getItem('movies')) {
                var highestMovie = JSON.parse(localStorage.getItem('movies'));
                var goodSingleData = highestMovie.items;
                goodSingleData = _.sortBy(highestMovie.items, function(movie) {
                    return movie.vote_average * -1;
                });
                Transparency.render(document.getElementById('home'), goodSingleData[0], favMovies.config.directives);
            } else {
                favMovies.config.xhr('GET', 'http://api.themoviedb.org/3/list/5454b8dbc3a3681478003cf7?api_key=56506e6256a280dcd69573fa48f1f3fd', function(response) { 
                    // De response van de request wordt eerst gemanipuleerd en daar in de localStorage gezet.
                    favMovies.config.manipulateData(response);
                    // Data wordt weer opgehaald uit de localstorage.
                    var highestMovie = JSON.parse(localStorage.getItem('movies'));
                    var goodSingleData = highestMovie.items;
                    goodSingleData = _.sortBy(highestMovie.items, function(movie) {
                        return movie.vote_average * -1;
                    });
                    Transparency.render(document.getElementById('home'), goodSingleData[0], favMovies.config.directives);
                });
            }
        },
        toggle: function(section) {
            // Alle sections in de pagina worden in een variabel gezet.
            var sections = document.querySelectorAll('section');
            // Alle active classes worden verwijderd in een for loop.
            for (i = 0; i < sections.length; i++) {
                sections[i].classList.remove('active');
            }
            // Pakt de meegegeven parameter en alleen bij de juite section wordt de class active toegevoegd.
            document.getElementById(section).classList.add('active');
        }
    };

    // Hammer.js object voor het swipe effect.
    favMovies.swipeEffect = {
        init: function() {

            function dragElement(event) {
                var elementToDrag = event.target;
                elementToDrag.style.left = event.gesture.deltaX + 'px';
            };

            function initTouchListeners(touchableElement) {
                var touchControl = new Hammer(touchableElement);
                touchControl.on('dragright', dragElement);
            };

            initTouchListeners(document.getElementById('movie'));

            // Swipe right op de bijbehorende ID zorgt ervoor dat er op een element geklikt wordt.
            // Je gaat bij deze een pagia terug.
            // var hammertime = Hammer(singleMovie).on("dragright", function(event) {
            //     history.go(-1);
            // });

        }
    };

    // Config object
    favMovies.config = {
        init: function() {
            this.orderBy();
        },
        manipulateData: function(response) {
            // De data uit de parameter wordt omgezet naar objecten en in een variabel gestopt.
            var movieData = JSON.parse(response);

            // Dat wordt omgezet naar strings en opgeslagen in de localstorage.
            localStorage.setItem('movies', JSON.stringify(movieData));
        },
        // De conent wordt eerst door de directives gehaald voordat het in de html geplaatst wordt.
        directives: {
            // Zorgt ervoor dat de toegewezen data in de src terecht komt in plaats van text.
            description: {
                html: function() {
                    return this.aboutDescription;
                }
            },
            imageUrl: {
                src: function() {
                    return "http://image.tmdb.org/t/p/w500" + this.poster_path;
                }
            },
            releaseDate: {
                text: function() {
                    var datum = new Date(this.release_date);
                    var dd = datum.getDate();
                    var mm = datum.getMonth();
                    var yyyy = datum.getFullYear();
                    var monthNames = [ "Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December" ];
                    return "Released on " + dd + " " + monthNames[mm] + " " + yyyy;
                }
            },
            detailLink: {
                href: function() {
                    return "#movie/" + this.id;
                },
                text: function() {
                    return "Meer info";
                }
            },
            stemmen: {
                text: function() {
                    return this.vote_average + " door " + this.vote_count + " mensen gestemd.";
                }
            },
            sterren: {
                value: function() {
                    return this.vote_average * 10;
                },
                alt: function() {
                    return this.vote_average;
                }
            }
        }, 
        // Xml request
        xhr: function (type, url, success, data) {
            var req = new XMLHttpRequest;
            req.open(type, url, true);
            req.setRequestHeader('Content-type','application/json');
            type === 'POST' ? req.send(data) : req.send(null);
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    if (req.status === 200 || req.status === 201) {
                        success(req.responseText);
                    }
                }
            }
        },
        bind: function (data) { 
            console.log(data); 
        },
        jsonpData: function(id) {
            var script = document.createElement("script"); 
            script.src = 'http://api.themoviedb.org/3/movie/'+ id + '?api_key=56506e6256a280dcd69573fa48f1f3fd&callback=favMovies.section.movie'; 
            document.body.appendChild(script); 
        },
        orderBy: function() {
            document.getElementById('genre').onclick = function() {

                var className = '' + genre.className + ' ';

                if ( ~className.indexOf(' visible ') ) {
                    this.className = className.replace(' visible ', ' ');
                } else {
                    this.className += ' visible';
                }              
            }
        }
    };

    // De controller is het eerste wat het bestand uitvoert.
    favMovies.controller.init();
})();