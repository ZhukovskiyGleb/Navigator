requirejs.config({
    baseUrl: './',
    paths: {
        'app':'app'
    }
});

requirejs(['app'], function(MyApp) {
    console.log('Application ready!');
});
