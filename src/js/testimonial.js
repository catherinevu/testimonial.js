Testimonial = function($container, options) {
  this.$container = $container;
  this.pluginOptions = {};

  this.$slides = [];
  this.dataArr = [];
  this.currentSlideIndex = 0;

  this.initPlugin(options);
};

Testimonial.prototype = {
  initPlugin: function(options) {
    this.createOptions(options);
    this.parseDomTree();
    this.createSlides();
    this.createInfrastructure();
    this.slideRendering();
    this.resizePluginContainer();

    if (this.pluginOptions.autostart) {
      this.start();
    }
  },

  start: function() {
    this.timerId = setInterval(function() {
        testimonial.next();
      },
      this.pluginOptions.timeout);
  },

  stop: function() {
    clearInterval(this.timerId);
    this.timerId = undefined;
  },

  next: function() {
    if (this.timerId !== undefined) {
      this.stop();
    }

    var currentSlide = this.$slides[this.currentSlideIndex];
    this.indexing();
    var nextSlide = this.$slides[this.currentSlideIndex];

    currentSlide.animateHide();
    nextSlide.animateShow();
    this.resizePluginContainer();

    this.start();
  },

  createOptions: function(options) {
    var defaultOptions = this.getDefaultOptions();
    this.pluginOptions = $.extend(defaultOptions, options);
  },

  getDefaultOptions: function() {
    var defaultOptions = {
      timeout: 7000,
      autostart: true
    };
    return defaultOptions;
  },

  slideRendering: function() {
    for (var i = 0; i < this.$slides.length; i++) {
      var $slide = this.$slides[i];
      if (i !== 0) {
        $slide.hideSlide();
      }
      this.$slidesWrapper.append($slide.getNode());
    }
  },

  parseDomTree: function() {
    var $nodeArr = this.$container.children();
    $nodeArr.remove();

    var parser = new Parser($nodeArr);
    this.dataArr = parser.parse();
  },

  createSlides: function() {
    for (var i = 0; i < this.dataArr.length; i++) {
      var data = this.dataArr[i];
      var $slide = new TestimonialSlide(data);
      this.$slides.push($slide);
    }
  },

  createInfrastructure: function() {
    this.$slidesWrapper = $('<div />', {
      'class': 'main_container'
    });
    this.$container.append(this.$slidesWrapper);
    this.createButtonNext();
  },

  createButtonNext: function() {
    var $buttonNext = $('<div />', {
      'class': 'next_slide'
    });
    $buttonNext.click(function() {
      testimonial.next();
    });
    this.$container.append($buttonNext);
  },

  resizePluginContainer: function() {
    var indents = 20;
    var slideHeight = this.$slides[this.currentSlideIndex].height();

    this.$container.height(slideHeight + indents);
  },

  indexing: function() {
    this.currentSlideIndex++;
    if (this.currentSlideIndex === this.$slides.length) {
      this.currentSlideIndex = 0;
    }
  }
};