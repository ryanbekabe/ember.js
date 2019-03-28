/**
@module ember
*/

import { alias, computed, get } from '@ember/-internals/metal';
import { isSimpleClick } from '@ember/-internals/views';
import { EMBER_GLIMMER_ANGLE_BRACKET_BUILT_INS } from '@ember/canary-features';
import { assert, warn } from '@ember/debug';
import { flaggedInstrument } from '@ember/instrumentation';
import { assign } from '@ember/polyfills';
import { inject as injectService } from '@ember/service';
import { DEBUG } from '@glimmer/env';
import EmberComponent, { HAS_BLOCK } from '../component';
import layout from '../templates/link-to';

let LinkComponent: any;

if (EMBER_GLIMMER_ANGLE_BRACKET_BUILT_INS) {
  /**
    The `LinkTo` component renders a link to the supplied `routeName` passing an optionally
    supplied model to the route as its `model` context of the route. The block for `LinkTo`
    becomes the contents of the rendered element:

    ```handlebars
    <LinkTo @route='photoGallery'>
      Great Hamster Photos
    </LinkTo>
    ```

    This will result in:

    ```html
    <a href="/hamster-photos">
      Great Hamster Photos
    </a>
    ```

    ### Disabling the `LinkTo` component

    The `LinkTo` component can be disabled by using the `disabled` argument. A disabled link
    doesn't result in a transition when activated, and adds the `disabled` class to the `<a>`
    element.

    (The class name to apply to the element can be overridden by using the `disabledClass`
    argument)

    ```handlebars
    <LinkTo @route='photoGallery' @disabled={{true}}>
      Great Hamster Photos
    </LinkTo>
    ```

    ### Handling `href`

    `<LinkTo>` will use your application's Router to fill the element's `href` property with a URL
    that matches the path to the supplied `routeName`.

    ### Handling current route

    The `LinkTo` component will apply a CSS class name of 'active' when the application's current
    route matches the supplied routeName. For example, if the application's current route is
    'photoGallery.recent', then the following invocation of `LinkTo`:

    ```handlebars
    <LinkTo @route='photoGallery.recent'>
      Great Hamster Photos
    </LinkTo>
    ```

    will result in

    ```html
    <a href="/hamster-photos/this-week" class="active">
      Great Hamster Photos
    </a>
    ```

    The CSS class used for active classes can be customized by passing an `activeClass` argument:

    ```handlebars
    <LinkTo @route='photoGallery.recent' @activeClass="current-url">
      Great Hamster Photos
    </LinkTo>
    ```

    ```html
    <a href="/hamster-photos/this-week" class="current-url">
      Great Hamster Photos
    </a>
    ```

    ### Keeping a link active for other routes

    If you need a link to be 'active' even when it doesn't match the current route, you can use the
    `current-when` argument.

    ```handlebars
    <LinkTo @route='photoGallery' @current-when='photos'>
      Photo Gallery
    </LinkTo>
    ```

    This may be helpful for keeping links active for:

    * non-nested routes that are logically related
    * some secondary menu approaches
    * 'top navigation' with 'sub navigation' scenarios

    A link will be active if `current-when` is `true` or the current
    route is the route this link would transition to.

    To match multiple routes 'space-separate' the routes:

    ```handlebars
    <LinkTo @route='gallery' @current-when='photos drawings paintings'>
      Art Gallery
    </LinkTo>
    ```

    ### Supplying a model

    An optional `model` argument can be used for routes whose
    paths contain dynamic segments. This argument will become
    the model context of the linked route:

    ```javascript
    Router.map(function() {
      this.route("photoGallery", {path: "hamster-photos/:photo_id"});
    });
    ```

    ```handlebars
    <LinkTo @route='photoGallery' @model={{this.aPhoto}}>
      {{aPhoto.title}}
    </LinkTo>
    ```

    ```html
    <a href="/hamster-photos/42">
      Tomster
    </a>
    ```

    ### Supplying multiple models

    For deep-linking to route paths that contain multiple
    dynamic segments, the `models` argument can be used.

    As the router transitions through the route path, each
    supplied model argument will become the context for the
    route with the dynamic segments:

    ```javascript
    Router.map(function() {
      this.route("photoGallery", { path: "hamster-photos/:photo_id" }, function() {
        this.route("comment", {path: "comments/:comment_id"});
      });
    });
    ```

    This argument will become the model context of the linked route:

    ```handlebars
    <LinkTo @route='photoGallery.comment' @models={{array this.aPhoto this.comment}}>
      {{comment.body}}
    </LinkTo>
    ```

    ```html
    <a href="/hamster-photos/42/comments/718">
      A+++ would snuggle again.
    </a>
    ```

    ### Supplying an explicit dynamic segment value

    If you don't have a model object available to pass to `LinkTo`,
    an optional string or integer argument can be passed for routes whose
    paths contain dynamic segments. This argument will become the value
    of the dynamic segment:

    ```javascript
    Router.map(function() {
      this.route("photoGallery", { path: "hamster-photos/:photo_id" });
    });
    ```

    ```handlebars
    <LinkTo @route='photoGallery' @model={{aPhotoId}}>
      {{this.aPhoto.title}}
    </LinkTo>
    ```

    ```html
    <a href="/hamster-photos/42">
      Tomster
    </a>
    ```

    When transitioning into the linked route, the `model` hook will
    be triggered with parameters including this passed identifier.

    ### Allowing Default Action

    By default the `<LinkTo>` component prevents the default browser action by calling
    `preventDefault()` to avoid reloading the browser page.

    If you need to trigger a full browser reload pass `@preventDefault={{false}}`:

    ```handlebars
    <LinkTo @route='photoGallery' @model={{this.aPhotoId}} @preventDefault={{false}}>
      {{this.aPhotoId.title}}
    </LinkTo>
    ```

    ### Supplying a `tagName`

    By default `<LinkTo>` renders an `<a>` element. This can be overridden for a single use of
    `<LinkTo>` by supplying a `tagName` argument:

    ```handlebars
    <LinkTo @route='photoGallery' @tagName='li'>
      Great Hamster Photos
    </LinkTo>
    ```

    This produces:

    ```html
    <li>
      Great Hamster Photos
    </li>
    ```

    In general, this is not recommended. Instead, you can use the `transition-to` helper together
    with a click event handler on the HTML tag of your choosing.

    @for Ember.Templates.components
    @method LinkTo
    @see {LinkComponent}
    @public
  */

  /**
    @module @ember/routing
  */

  /**
    See [Ember.Templates.components.LinkTo](/api/ember/release/classes/Ember.Templates.components/methods/input?anchor=input).

    @for Ember.Templates.helpers
    @method link-to
    @see {Ember.Templates.components.LinkTo}
    @public
  **/

  /**
    `LinkComponent` is the internal component invoked with `<LinkTo>` or `{{link-to}}`.

    @class LinkComponent
    @extends Component
    @see {Ember.Templates.components.LinkTo}
    @public
  **/

  const UNDEFINED = Object.freeze({
    toString() {
      return 'UNDEFINED';
    },
  });

  const EMPTY_QUERY_PARAMS = Object.freeze({});

  LinkComponent = EmberComponent.extend({
    layout,

    tagName: 'a',

    /**
      @property route
      @category EMBER_GLIMMER_ANGLE_BRACKET_BUILT_INS
      @public
    */
    route: UNDEFINED,

    /**
      @property model
      @category EMBER_GLIMMER_ANGLE_BRACKET_BUILT_INS
      @public
    */
    model: UNDEFINED,

    /**
      @property models
      @category EMBER_GLIMMER_ANGLE_BRACKET_BUILT_INS
      @public
    */
    models: UNDEFINED,

    /**
      @property query
      @category EMBER_GLIMMER_ANGLE_BRACKET_BUILT_INS
      @public
    */
    query: UNDEFINED,

    /**
      Used to determine when this `LinkComponent` is active.

      @property current-when
      @public
    */
    'current-when': null,

    /**
      Sets the `title` attribute of the `LinkComponent`'s HTML element.

      @property title
      @default null
      @public
    **/
    title: null,

    /**
      Sets the `rel` attribute of the `LinkComponent`'s HTML element.

      @property rel
      @default null
      @public
    **/
    rel: null,

    /**
      Sets the `tabindex` attribute of the `LinkComponent`'s HTML element.

      @property tabindex
      @default null
      @public
    **/
    tabindex: null,

    /**
      Sets the `target` attribute of the `LinkComponent`'s HTML element.

      @since 1.8.0
      @property target
      @default null
      @public
    **/
    target: null,

    /**
      The CSS class to apply to `LinkComponent`'s element when its `active`
      property is `true`.

      @property activeClass
      @type String
      @default active
      @public
    **/
    activeClass: 'active',

    /**
      The CSS class to apply to `LinkComponent`'s element when its `loading`
      property is `true`.

      @property loadingClass
      @type String
      @default loading
      @private
    **/
    loadingClass: 'loading',

    /**
      The CSS class to apply to a `LinkComponent`'s element when its `disabled`
      property is `true`.

      @property disabledClass
      @type String
      @default disabled
      @private
    **/
    disabledClass: 'disabled',

    /**
      Determines whether the `LinkComponent` will trigger routing via
      the `replaceWith` routing strategy.

      @property replace
      @type Boolean
      @default false
      @public
    **/
    replace: false,

    /**
      By default this component will forward `href`, `title`, `rel`, `tabindex`, and `target`
      arguments to attributes on the component's element. When invoked with `{{link-to}}`, you can
      only customize these attributes. When invoked with `<LinkTo>`, you can just use HTML
      attributes directly.

      @property attributeBindings
      @type Array | String
      @default ['title', 'rel', 'tabindex', 'target']
      @public
    */
    attributeBindings: ['href', 'title', 'rel', 'tabindex', 'target'],

    /**
      By default this component will set classes on its element when any of the following arguments
      are truthy:

      * active
      * loading
      * disabled

      When these arguments are truthy, a class with the same name will be set on the element. When
      falsy, the associated class will not be on the element.

      @property classNameBindings
      @type Array
      @default ['active', 'loading', 'disabled', 'ember-transitioning-in', 'ember-transitioning-out']
      @public
    */
    classNameBindings: ['active', 'loading', 'disabled', 'transitioningIn', 'transitioningOut'],

    /**
      By default this component responds to the `click` event. When the component element is an
      `<a>` element, activating the link in another way, such as using the keyboard, triggers the
      click event.

      @property eventName
      @type String
      @default click
      @private
    */
    eventName: 'click',

    // this is doc'ed here so it shows up in the events
    // section of the API documentation, which is where
    // people will likely go looking for it.
    /**
      Triggers the `LinkComponent`'s routing behavior. If
      `eventName` is changed to a value other than `click`
      the routing behavior will trigger on that custom event
      instead.

      @event click
      @private
    */

    /**
      An overridable method called when `LinkComponent` objects are instantiated.

      Example:

      ```app/components/my-link.js
      import LinkComponent from '@ember/routing/link-component';

      export default LinkComponent.extend({
        init() {
          this._super(...arguments);
          console.log('Event is ' + this.get('eventName'));
        }
      });
      ```

      NOTE: If you do override `init` for a framework class like `Component`,
      be sure to call `this._super(...arguments)` in your
      `init` declaration! If you don't, Ember may not have an opportunity to
      do important setup work, and you'll see strange behavior in your
      application.

      @method init
      @private
    */
    init() {
      this._super(...arguments);

      // Map desired event name to invoke function
      let { eventName } = this;
      this.on(eventName, this, this._invoke);
    },

    _routing: injectService('-routing'),
    _currentRoute: alias('_routing.currentRouteName'),
    _currentRouterState: alias('_routing.currentState'),
    _targetRouterState: alias('_routing.targetState'),

    _route: computed('route', '_currentRoute', function computeLinkToComponentRoute(this: any) {
      let { route } = this;
      return route === UNDEFINED ? this._currentRoute : route;
    }),

    _models: computed('model', 'models', function computeLinkToComponentModels(this: any) {
      let { model, models } = this;

      assert(
        'You cannot provide both the `@model` and `@models` arguments to the <LinkTo> component.',
        model === UNDEFINED || models === UNDEFINED
      );

      if (model !== UNDEFINED) {
        return [model];
      } else if (models !== UNDEFINED) {
        assert('The `@models` argument must be an array.', Array.isArray(models));
        return models;
      } else {
        return [];
      }
    }),

    _query: computed('query', function computeLinkToComponentQuery(this: any) {
      let { query } = this;

      if (query === UNDEFINED) {
        return EMPTY_QUERY_PARAMS;
      } else {
        return Object.assign({}, query);
      }
    }),

    /**
      Accessed as a classname binding to apply the component's `disabledClass`
      CSS `class` to the element when the link is disabled.

      When `true`, interactions with the element will not trigger route changes.
      @property disabled
      @private
    */
    disabled: computed({
      get(_key: string): boolean {
        // always returns false for `get` because (due to the `set` just below)
        // the cached return value from the set will prevent this getter from _ever_
        // being called after a set has occured
        return false;
      },

      set(this: any, _key: string, value: any): boolean {
        this._isDisabled = value;

        return value ? this.disabledClass : false;
      },
    }),

    /**
      Accessed as a classname binding to apply the component's `activeClass`
      CSS `class` to the element when the link is active.

      This component is considered active when its `currentWhen` property is `true`
      or the application's current route is the route this component would trigger
      transitions into.

      The `currentWhen` property can match against multiple routes by separating
      route names using the ` ` (space) character.

      @property active
      @private
    */
    active: computed('activeClass', '_active', function computeLinkToComponentActiveClass(
      this: any
    ) {
      return this._active ? this.activeClass : false;
    }),

    _active: computed(
      '_currentRouterState',
      '_route',
      '_models',
      '_query',
      'loading',
      'current-when',
      function computeLinkToComponentActive(this: any) {
        let { _currentRouterState: state } = this;

        if (state) {
          return this._isActive(state);
        } else {
          return false;
        }
      }
    ),

    willBeActive: computed(
      '_currentRouterState',
      '_targetRouterState',
      '_route',
      '_models',
      '_query',
      'loading',
      'current-when',
      function computeLinkToComponentWillBeActive(this: any) {
        let { _currentRouterState: current, _targetRouterState: target } = this;

        if (current === target) {
          return;
        }

        return this._isActive(target);
      }
    ),

    _isActive(routerState: any) {
      if (this.loading) {
        return false;
      }

      let currentWhen = this['current-when'];

      if (typeof currentWhen === 'boolean') {
        return currentWhen;
      }

      let isCurrentWhenSpecified = Boolean(currentWhen);

      if (isCurrentWhenSpecified) {
        currentWhen = currentWhen.split(' ');
      } else {
        currentWhen = [this._route];
      }

      let { _models: models, _query: query, _routing: routing } = this;

      for (let i = 0; i < currentWhen.length; i++) {
        if (
          routing.isActiveForRoute(
            models,
            query,
            currentWhen[i],
            routerState,
            isCurrentWhenSpecified
          )
        ) {
          return true;
        }
      }

      return false;
    },

    transitioningIn: computed(
      '_active',
      'willBeActive',
      function computeLinkToComponentTransitioningIn(this: any) {
        if (this.willBeActive === true && !this._active) {
          return 'ember-transitioning-in';
        } else {
          return false;
        }
      }
    ),

    transitioningOut: computed(
      '_active',
      'willBeActive',
      function computeLinkToComponentTransitioningOut(this: any) {
        if (this.willBeActive === false && this._active) {
          return 'ember-transitioning-out';
        } else {
          return false;
        }
      }
    ),

    /**
      Event handler that invokes the link, activating the associated route.

      @method _invoke
      @param {Event} event
      @private
    */
    _invoke(this: any, event: Event): boolean {
      if (!isSimpleClick(event)) {
        return true;
      }

      let { bubbles, preventDefault } = this;
      let target = this.element.target;
      let isSelf = !target || target === '_self';

      if (preventDefault !== false && isSelf) {
        event.preventDefault();
      }

      if (bubbles === false) {
        event.stopPropagation();
      }

      if (this._isDisabled) {
        return false;
      }

      if (this.loading) {
        // tslint:disable-next-line:max-line-length
        warn(
          'This link is in an inactive loading state because at least one of its models ' +
            'currently has a null/undefined value, or the provided route name is invalid.',
          false,
          {
            id: 'ember-glimmer.link-to.inactive-loading-state',
          }
        );
        return false;
      }

      if (!isSelf) {
        return false;
      }

      let {
        _route: routeName,
        _models: models,
        _query: queryParams,
        replace: shouldReplace,
      } = this;

      let payload = {
        queryParams,
        routeName,
      };

      flaggedInstrument(
        'interaction.link-to',
        payload,
        this._generateTransition(payload, routeName, models, queryParams, shouldReplace)
      );
      return false;
    },

    _generateTransition(
      payload: any,
      qualifiedRouteName: string,
      models: any[],
      queryParams: any[],
      shouldReplace: boolean
    ) {
      let { _routing: routing } = this;

      return () => {
        payload.transition = routing.transitionTo(
          qualifiedRouteName,
          models,
          queryParams,
          shouldReplace
        );
      };
    },

    /**
      Sets the element's `href` attribute to the url for
      the `LinkComponent`'s targeted route.

      If the `LinkComponent`'s `tagName` is changed to a value other
      than `a`, this property will be ignored.

      @property href
      @private
    */
    href: computed(
      '_route',
      '_models',
      '_query',
      'tagName',
      'loading',
      'loadingHref',
      function computeLinkToComponentHref(this: any) {
        if (this.tagName !== 'a') {
          return;
        }

        if (this.loading) {
          return this.loadingHref;
        }

        let { _route: route, _models: models, _query: query, _routing: routing } = this;

        if (DEBUG) {
          /*
           * Unfortunately, to get decent error messages, we need to do this.
           * In some future state we should be able to use a "feature flag"
           * which allows us to strip this without needing to call it twice.
           *
           * if (isDebugBuild()) {
           *   // Do the useful debug thing, probably including try/catch.
           * } else {
           *   // Do the performant thing.
           * }
           */
          try {
            return routing.generateURL(route, models, query);
          } catch (e) {
            // tslint:disable-next-line:max-line-length
            assert(
              `You attempted to generate a link for the "${this.route}" route, but did not ` +
                `pass the models required for generating its dynamic segments. ` +
                e.message
            );
          }
        } else {
          return routing.generateURL(route, models, query);
        }
      }
    ),

    loading: computed(
      '_route',
      '_modelsAreLoaded',
      'loadingClass',
      function computeLinkToComponentLoading(this: any) {
        let { _route: route, _modelsAreLoaded: loaded } = this;

        if (!loaded || route === null || route === undefined) {
          return this.loadingClass;
        }
      }
    ),

    _modelsAreLoaded: computed('_models', function computeLinkToComponentModelsAreLoaded(
      this: any
    ) {
      let { _models: models } = this;

      for (let i = 0; i < models.length; i++) {
        let model = models[i];
        if (model === null || model === undefined) {
          return false;
        }
      }

      return true;
    }),

    /**
      The default href value to use while a link-to is loading.
      Only applies when tagName is 'a'

      @property loadingHref
      @type String
      @default #
      @private
    */
    loadingHref: '#',

    didReceiveAttrs() {
      let { disabledWhen } = this;

      if (disabledWhen !== undefined) {
        this.set('disabled', disabledWhen);
      }

      let { params } = this;

      if (!params || params.length === 0) {
        assert(
          'You must provide at least one of the `@route`, `@model`, `@models` or `@query` argument to `<LinkTo>`.',
          !(
            this.route === UNDEFINED &&
            this.model === UNDEFINED &&
            this.models === UNDEFINED &&
            this.query === UNDEFINED
          )
        );

        if (DEBUG && this.query === UNDEFINED) {
          let { _models: models } = this;
          let lastModel = models.length > 0 && models[models.length - 1];

          assert(
            'The `(query-params)` helper can only be used when invoking the `{{link-to}}` component.',
            !(lastModel && lastModel.isQueryParams)
          );
        }

        return;
      }

      params = params.slice();

      // Process the positional arguments, in order.
      // 1. Inline link title comes first, if present.
      if (!this[HAS_BLOCK]) {
        this.set('linkTitle', params.shift());
      }

      // 2. The last argument is possibly the `query` object.
      let queryParams = params[params.length - 1];

      if (queryParams && queryParams.isQueryParams) {
        this.set('query', params.pop().values);
      } else {
        this.set('query', UNDEFINED);
      }

      // 3. If there is a `route`, it is now at index 0.
      if (params.length === 0) {
        this.set('route', UNDEFINED);
      } else {
        this.set('route', params.shift());
      }

      // 4. Any remaining indices (if any) are `models`.
      this.set('model', UNDEFINED);
      this.set('models', params);
    },
  });

  LinkComponent.toString = () => '@ember/routing/link-component';

  LinkComponent.reopenClass({
    positionalParams: 'params',
  });
} else {
  /**
    The `{{link-to}}` component renders a link to the supplied
    `routeName` passing an optionally supplied model to the
    route as its `model` context of the route. The block
    for `{{link-to}}` becomes the innerHTML of the rendered
    element:

    ```handlebars
    {{#link-to 'photoGallery'}}
      Great Hamster Photos
    {{/link-to}}
    ```

    You can also use an inline form of `{{link-to}}` component by
    passing the link text as the first argument
    to the component:

    ```handlebars
    {{link-to 'Great Hamster Photos' 'photoGallery'}}
    ```

    Both will result in:

    ```html
    <a href="/hamster-photos">
      Great Hamster Photos
    </a>
    ```

    ### Supplying a tagName
    By default `{{link-to}}` renders an `<a>` element. This can
    be overridden for a single use of `{{link-to}}` by supplying
    a `tagName` option:

    ```handlebars
    {{#link-to 'photoGallery' tagName="li"}}
      Great Hamster Photos
    {{/link-to}}
    ```

    ```html
    <li>
      Great Hamster Photos
    </li>
    ```

    To override this option for your entire application, see
    "Overriding Application-wide Defaults".

    ### Disabling the `link-to` component
    By default `{{link-to}}` is enabled.
    any passed value to the `disabled` component property will disable
    the `link-to` component.

    static use: the `disabled` option:

    ```handlebars
    {{#link-to 'photoGallery' disabled=true}}
      Great Hamster Photos
    {{/link-to}}
    ```

    dynamic use: the `disabledWhen` option:

    ```handlebars
    {{#link-to 'photoGallery' disabledWhen=controller.someProperty}}
      Great Hamster Photos
    {{/link-to}}
    ```

    any truthy value passed to `disabled` will disable it except `undefined`.

    See "Overriding Application-wide Defaults" for more.

    ### Handling `href`
    `{{link-to}}` will use your application's Router to
    fill the element's `href` property with a url that
    matches the path to the supplied `routeName` for your
    router's configured `Location` scheme, which defaults
    to HashLocation.

    ### Handling current route
    `{{link-to}}` will apply a CSS class name of 'active'
    when the application's current route matches
    the supplied routeName. For example, if the application's
    current route is 'photoGallery.recent' the following
    use of `{{link-to}}`:

    ```handlebars
    {{#link-to 'photoGallery.recent'}}
      Great Hamster Photos
    {{/link-to}}
    ```

    will result in

    ```html
    <a href="/hamster-photos/this-week" class="active">
      Great Hamster Photos
    </a>
    ```

    The CSS class name used for active classes can be customized
    for a single use of `{{link-to}}` by passing an `activeClass`
    option:

    ```handlebars
    {{#link-to 'photoGallery.recent' activeClass="current-url"}}
      Great Hamster Photos
    {{/link-to}}
    ```

    ```html
    <a href="/hamster-photos/this-week" class="current-url">
      Great Hamster Photos
    </a>
    ```

    To override this option for your entire application, see
    "Overriding Application-wide Defaults".

    ### Keeping a link active for other routes

    If you need a link to be 'active' even when it doesn't match
    the current route, you can use the `current-when` argument.

    ```handlebars
    {{#link-to 'photoGallery' current-when='photos'}}
      Photo Gallery
    {{/link-to}}
    ```

    This may be helpful for keeping links active for:

    * non-nested routes that are logically related
    * some secondary menu approaches
    * 'top navigation' with 'sub navigation' scenarios

    A link will be active if `current-when` is `true` or the current
    route is the route this link would transition to.

    To match multiple routes 'space-separate' the routes:

    ```handlebars
    {{#link-to 'gallery' current-when='photos drawings paintings'}}
      Art Gallery
    {{/link-to}}
    ```

    ### Supplying a model
    An optional model argument can be used for routes whose
    paths contain dynamic segments. This argument will become
    the model context of the linked route:

    ```javascript
    Router.map(function() {
      this.route("photoGallery", {path: "hamster-photos/:photo_id"});
    });
    ```

    ```handlebars
    {{#link-to 'photoGallery' aPhoto}}
      {{aPhoto.title}}
    {{/link-to}}
    ```

    ```html
    <a href="/hamster-photos/42">
      Tomster
    </a>
    ```

    ### Supplying multiple models
    For deep-linking to route paths that contain multiple
    dynamic segments, multiple model arguments can be used.
    As the router transitions through the route path, each
    supplied model argument will become the context for the
    route with the dynamic segments:

    ```javascript
    Router.map(function() {
      this.route("photoGallery", { path: "hamster-photos/:photo_id" }, function() {
        this.route("comment", {path: "comments/:comment_id"});
      });
    });
    ```
    This argument will become the model context of the linked route:

    ```handlebars
    {{#link-to 'photoGallery.comment' aPhoto comment}}
      {{comment.body}}
    {{/link-to}}
    ```

    ```html
    <a href="/hamster-photos/42/comments/718">
      A+++ would snuggle again.
    </a>
    ```

    ### Supplying an explicit dynamic segment value
    If you don't have a model object available to pass to `{{link-to}}`,
    an optional string or integer argument can be passed for routes whose
    paths contain dynamic segments. This argument will become the value
    of the dynamic segment:

    ```javascript
    Router.map(function() {
      this.route("photoGallery", { path: "hamster-photos/:photo_id" });
    });
    ```

    ```handlebars
    {{#link-to 'photoGallery' aPhotoId}}
      {{aPhoto.title}}
    {{/link-to}}
    ```

    ```html
    <a href="/hamster-photos/42">
      Tomster
    </a>
    ```

    When transitioning into the linked route, the `model` hook will
    be triggered with parameters including this passed identifier.

    ### Allowing Default Action

    By default the `{{link-to}}` component prevents the default browser action
    by calling `preventDefault()` as this sort of action bubbling is normally
    handled internally and we do not want to take the browser to a new URL (for
    example).

    If you need to override this behavior specify `preventDefault=false` in
    your template:

    ```handlebars
    {{#link-to 'photoGallery' aPhotoId preventDefault=false}}
      {{aPhotoId.title}}
    {{/link-to}}
    ```

    ### Overriding attributes
    You can override any given property of the `LinkComponent`
    that is generated by the `{{link-to}}` component by passing
    key/value pairs, like so:

    ```handlebars
    {{#link-to  aPhoto tagName='li' title='Following this link will change your life' classNames='pic sweet'}}
      Uh-mazing!
    {{/link-to}}
    ```

    See [LinkComponent](/api/ember/release/classes/LinkComponent) for a
    complete list of overrideable properties. Be sure to also
    check out inherited properties of `LinkComponent`.

    ### Overriding Application-wide Defaults

    ``{{link-to}}`` creates an instance of `LinkComponent` for rendering. To
    override options for your entire application, export your customized
    `LinkComponent` from `app/components/link-to.js` with the desired overrides:

    ```javascript
    // app/components/link-to.js
    import LinkComponent from '@ember/routing/link-component';

    export default LinkComponent.extend({
      activeClass: "is-active",
      tagName: 'li'
    })
    ```

    It is also possible to override the default event in this manner:

    ```javascript
    import LinkComponent from '@ember/routing/link-component';

    export default LinkComponent.extend({
      eventName: 'customEventName'
    });
    ```

    @method link-to
    @for Ember.Templates.helpers
    @param {String} routeName
    @param {Object} [context]*
    @param [options] {Object} Handlebars key/value pairs of options, you can override any property of Ember.LinkComponent
    @return {String} HTML string
    @see {LinkComponent}
    @public
  */

  /**
    @module @ember/routing
  */

  /**
    `LinkComponent` renders an element whose `click` event triggers a
    transition of the application's instance of `Router` to
    a supplied route by name.

    `LinkComponent` components are invoked with {{#link-to}}. Properties
    of this class can be overridden with `reopen` to customize application-wide
    behavior.

    @class LinkComponent
    @extends Component
    @see {Ember.Templates.helpers.link-to}
    @public
  **/

  const EMPTY_QUERY_PARAMS = Object.freeze({ values: Object.freeze({}) });

  LinkComponent = EmberComponent.extend({
    layout,

    tagName: 'a',

    /**
      Used to determine when this `LinkComponent` is active.

      @property current-when
      @public
    */
    'current-when': null,

    /**
      Sets the `title` attribute of the `LinkComponent`'s HTML element.

      @property title
      @default null
      @public
    **/
    title: null,

    /**
      Sets the `rel` attribute of the `LinkComponent`'s HTML element.

      @property rel
      @default null
      @public
    **/
    rel: null,

    /**
      Sets the `tabindex` attribute of the `LinkComponent`'s HTML element.

      @property tabindex
      @default null
      @public
    **/
    tabindex: null,

    /**
      Sets the `target` attribute of the `LinkComponent`'s HTML element.

      @since 1.8.0
      @property target
      @default null
      @public
    **/
    target: null,

    /**
      The CSS class to apply to `LinkComponent`'s element when its `active`
      property is `true`.

      @property activeClass
      @type String
      @default active
      @public
    **/
    activeClass: 'active',

    /**
      The CSS class to apply to `LinkComponent`'s element when its `loading`
      property is `true`.

      @property loadingClass
      @type String
      @default loading
      @private
    **/
    loadingClass: 'loading',

    /**
      The CSS class to apply to a `LinkComponent`'s element when its `disabled`
      property is `true`.

      @property disabledClass
      @type String
      @default disabled
      @private
    **/
    disabledClass: 'disabled',

    /**
      Determines whether the `LinkComponent` will trigger routing via
      the `replaceWith` routing strategy.

      @property replace
      @type Boolean
      @default false
      @public
    **/
    replace: false,

    /**
      By default the `{{link-to}}` component will bind to the `href` and
      `title` attributes. It's discouraged that you override these defaults,
      however you can push onto the array if needed.

      @property attributeBindings
      @type Array | String
      @default ['title', 'rel', 'tabindex', 'target']
      @public
    */
    attributeBindings: ['href', 'title', 'rel', 'tabindex', 'target'],

    /**
      By default the `{{link-to}}` component will bind to the `active`, `loading`,
      and `disabled` classes. It is discouraged to override these directly.

      @property classNameBindings
      @type Array
      @default ['active', 'loading', 'disabled', 'ember-transitioning-in', 'ember-transitioning-out']
      @public
    */
    classNameBindings: ['active', 'loading', 'disabled', 'transitioningIn', 'transitioningOut'],

    /**
      By default the `{{link-to}}` component responds to the `click` event. You
      can override this globally by setting this property to your custom
      event name.

      This is particularly useful on mobile when one wants to avoid the 300ms
      click delay using some sort of custom `tap` event.

      @property eventName
      @type String
      @default click
      @private
    */
    eventName: 'click',

    // this is doc'ed here so it shows up in the events
    // section of the API documentation, which is where
    // people will likely go looking for it.
    /**
      Triggers the `LinkComponent`'s routing behavior. If
      `eventName` is changed to a value other than `click`
      the routing behavior will trigger on that custom event
      instead.

      @event click
      @private
    */

    /**
      An overridable method called when `LinkComponent` objects are instantiated.

      Example:

      ```app/components/my-link.js
      import LinkComponent from '@ember/routing/link-component';

      export default LinkComponent.extend({
        init() {
          this._super(...arguments);
          console.log('Event is ' + this.get('eventName'));
        }
      });
      ```

      NOTE: If you do override `init` for a framework class like `Component`,
      be sure to call `this._super(...arguments)` in your
      `init` declaration! If you don't, Ember may not have an opportunity to
      do important setup work, and you'll see strange behavior in your
      application.

      @method init
      @private
    */
    init() {
      this._super(...arguments);

      // Map desired event name to invoke function
      let eventName = get(this, 'eventName');
      this.on(eventName, this, this._invoke);
    },

    _routing: injectService('-routing'),

    /**
      Accessed as a classname binding to apply the `LinkComponent`'s `disabledClass`
      CSS `class` to the element when the link is disabled.

      When `true` interactions with the element will not trigger route changes.
      @property disabled
      @private
    */
    disabled: computed({
      get(_key: string): boolean {
        // always returns false for `get` because (due to the `set` just below)
        // the cached return value from the set will prevent this getter from _ever_
        // being called after a set has occured
        return false;
      },

      set(_key: string, value: any): boolean {
        (this as any)._isDisabled = value;

        return value ? get(this, 'disabledClass') : false;
      },
    }),

    _isActive(routerState: any) {
      if (get(this, 'loading')) {
        return false;
      }

      let currentWhen = get(this, 'current-when');

      if (typeof currentWhen === 'boolean') {
        return currentWhen;
      }

      let isCurrentWhenSpecified = Boolean(currentWhen);
      currentWhen = currentWhen || get(this, 'qualifiedRouteName');
      currentWhen = currentWhen.split(' ');

      let routing = this._routing;
      let models = get(this, 'models');
      let resolvedQueryParams = get(this, 'resolvedQueryParams');

      for (let i = 0; i < currentWhen.length; i++) {
        if (
          routing.isActiveForRoute(
            models,
            resolvedQueryParams,
            currentWhen[i],
            routerState,
            isCurrentWhenSpecified
          )
        ) {
          return true;
        }
      }

      return false;
    },

    /**
      Accessed as a classname binding to apply the `LinkComponent`'s `activeClass`
      CSS `class` to the element when the link is active.

      A `LinkComponent` is considered active when its `currentWhen` property is `true`
      or the application's current route is the route the `LinkComponent` would trigger
      transitions into.

      The `currentWhen` property can match against multiple routes by separating
      route names using the ` ` (space) character.

      @property active
      @private
    */
    active: computed('activeClass', '_active', function computeLinkToComponentActiveClass(
      this: any
    ) {
      return this.get('_active') ? get(this, 'activeClass') : false;
    }),

    _active: computed(
      '_routing.currentState',
      'attrs.params',
      function computeLinkToComponentActive(this: any) {
        let currentState = get(this, '_routing.currentState');
        if (!currentState) {
          return false;
        }
        return this._isActive(currentState);
      }
    ),

    willBeActive: computed('_routing.targetState', function computeLinkToComponentWillBeActive(
      this: any
    ) {
      let routing = this._routing;
      let targetState = get(routing, 'targetState');
      if (get(routing, 'currentState') === targetState) {
        return;
      }

      return this._isActive(targetState);
    }),

    transitioningIn: computed(
      'active',
      'willBeActive',
      function computeLinkToComponentTransitioningIn(this: any) {
        if (get(this, 'willBeActive') === true && !get(this, '_active')) {
          return 'ember-transitioning-in';
        } else {
          return false;
        }
      }
    ),

    transitioningOut: computed(
      'active',
      'willBeActive',
      function computeLinkToComponentTransitioningOut(this: any) {
        if (get(this, 'willBeActive') === false && get(this, '_active')) {
          return 'ember-transitioning-out';
        } else {
          return false;
        }
      }
    ),

    /**
      Event handler that invokes the link, activating the associated route.

      @method _invoke
      @param {Event} event
      @private
    */
    _invoke(this: any, event: Event): boolean {
      if (!isSimpleClick(event)) {
        return true;
      }

      let preventDefault = get(this, 'preventDefault');
      let targetAttribute = get(this, 'target');

      if (preventDefault !== false && (!targetAttribute || targetAttribute === '_self')) {
        event.preventDefault();
      }

      if (get(this, 'bubbles') === false) {
        event.stopPropagation();
      }

      if (this._isDisabled) {
        return false;
      }

      if (get(this, 'loading')) {
        // tslint:disable-next-line:max-line-length
        warn(
          'This link-to is in an inactive loading state because at least one of its parameters presently has a null/undefined value, or the provided route name is invalid.',
          false,
          {
            id: 'ember-glimmer.link-to.inactive-loading-state',
          }
        );
        return false;
      }

      if (targetAttribute && targetAttribute !== '_self') {
        return false;
      }

      let qualifiedRouteName = get(this, 'qualifiedRouteName');
      let models = get(this, 'models');
      let queryParams = get(this, 'queryParams.values');
      let shouldReplace = get(this, 'replace');

      let payload = {
        queryParams,
        routeName: qualifiedRouteName,
      };

      // tslint:disable-next-line:max-line-length
      flaggedInstrument(
        'interaction.link-to',
        payload,
        this._generateTransition(payload, qualifiedRouteName, models, queryParams, shouldReplace)
      );
      return false;
    },

    _generateTransition(
      payload: any,
      qualifiedRouteName: string,
      models: any[],
      queryParams: any[],
      shouldReplace: boolean
    ) {
      let routing = this._routing;
      return () => {
        payload.transition = routing.transitionTo(
          qualifiedRouteName,
          models,
          queryParams,
          shouldReplace
        );
      };
    },

    queryParams: EMPTY_QUERY_PARAMS,

    qualifiedRouteName: computed(
      'targetRouteName',
      '_routing.currentState',
      function computeLinkToComponentQualifiedRouteName(this: any) {
        let params = get(this, 'params');
        let paramsLength = params.length;
        let lastParam = params[paramsLength - 1];
        if (lastParam && lastParam.isQueryParams) {
          paramsLength--;
        }
        let onlyQueryParamsSupplied = this[HAS_BLOCK] ? paramsLength === 0 : paramsLength === 1;
        if (onlyQueryParamsSupplied) {
          return get(this, '_routing.currentRouteName');
        }
        return get(this, 'targetRouteName');
      }
    ),

    resolvedQueryParams: computed('queryParams', function computeLinkToComponentResolvedQueryParams(
      this: any
    ) {
      let resolvedQueryParams = {};
      let queryParams = get(this, 'queryParams');

      if (queryParams !== EMPTY_QUERY_PARAMS) {
        let { values } = queryParams;
        assign(resolvedQueryParams, values);
      }

      return resolvedQueryParams;
    }),

    /**
      Sets the element's `href` attribute to the url for
      the `LinkComponent`'s targeted route.

      If the `LinkComponent`'s `tagName` is changed to a value other
      than `a`, this property will be ignored.

      @property href
      @private
    */
    href: computed('models', 'qualifiedRouteName', function computeLinkToComponentHref(this: any) {
      if (get(this, 'tagName') !== 'a') {
        return;
      }

      let qualifiedRouteName = get(this, 'qualifiedRouteName');
      let models = get(this, 'models');

      if (get(this, 'loading')) {
        return get(this, 'loadingHref');
      }

      let routing = this._routing;
      let queryParams = get(this, 'queryParams.values');

      if (DEBUG) {
        /*
         * Unfortunately, to get decent error messages, we need to do this.
         * In some future state we should be able to use a "feature flag"
         * which allows us to strip this without needing to call it twice.
         *
         * if (isDebugBuild()) {
         *   // Do the useful debug thing, probably including try/catch.
         * } else {
         *   // Do the performant thing.
         * }
         */
        try {
          routing.generateURL(qualifiedRouteName, models, queryParams);
        } catch (e) {
          // tslint:disable-next-line:max-line-length
          assert(
            'You attempted to define a `{{link-to "' +
              qualifiedRouteName +
              '"}}` but did not pass the parameters required for generating its dynamic segments. ' +
              e.message
          );
        }
      }

      return routing.generateURL(qualifiedRouteName, models, queryParams);
    }),

    loading: computed(
      '_modelsAreLoaded',
      'qualifiedRouteName',
      function computeLinkToComponentLoading(this: any) {
        let qualifiedRouteName = get(this, 'qualifiedRouteName');
        let modelsAreLoaded = get(this, '_modelsAreLoaded');

        if (!modelsAreLoaded || qualifiedRouteName === null || qualifiedRouteName === undefined) {
          return get(this, 'loadingClass');
        }
      }
    ),

    _modelsAreLoaded: computed('models', function computeLinkToComponentModelsAreLoaded(this: any) {
      let models = get(this, 'models');
      for (let i = 0; i < models.length; i++) {
        let model = models[i];
        if (model === null || model === undefined) {
          return false;
        }
      }

      return true;
    }),

    /**
      The default href value to use while a link-to is loading.
      Only applies when tagName is 'a'

      @property loadingHref
      @type String
      @default #
      @private
    */
    loadingHref: '#',

    didReceiveAttrs() {
      let queryParams;
      let params = get(this, 'params');

      if (params) {
        // Do not mutate params in place
        params = params.slice();
      }

      assert(
        'You must provide one or more parameters to the `{{link-to}}` component.',
        params && params.length > 0
      );

      let disabledWhen = get(this, 'disabledWhen');
      if (disabledWhen !== undefined) {
        this.set('disabled', disabledWhen);
      }

      // Process the positional arguments, in order.
      // 1. Inline link title comes first, if present.
      if (!this[HAS_BLOCK]) {
        this.set('linkTitle', params.shift());
      }

      // 2. `targetRouteName` is now always at index 0.
      this.set('targetRouteName', params[0]);

      // 3. The last argument (if still remaining) is the `queryParams` object.
      let lastParam = params[params.length - 1];

      if (lastParam && lastParam.isQueryParams) {
        queryParams = params.pop();
      } else {
        queryParams = EMPTY_QUERY_PARAMS;
      }
      this.set('queryParams', queryParams);

      // 4. Any remaining indices (excepting `targetRouteName` at 0) are `models`.
      params.shift();
      this.set('models', params);
    },
  });

  LinkComponent.toString = () => '@ember/routing/link-component';

  LinkComponent.reopenClass({
    positionalParams: 'params',
  });
}

export default LinkComponent;
