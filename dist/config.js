requirejs.config({
    baseUrl: './',
    paths: {
        'app':'final'
    }
});

requirejs(['app'], function(MyApp) {
    console.log('Application ready!');
});
