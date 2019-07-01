# 00

Hi guys
The video shows you some tests of mine running with Cypress.
Today, I'm gonna talking to you about Cypress and some end-to-end testing best practices.
I'm Stefano Magni, I'm a front-end developer, and I love everything about testing and automation, that's why I'm so excited to be here today!

First of all: everything I'm gonna show to you is public, both the slides and the repository with the examples. I'm gonna post them on Twitter, Facebook, LinkedIn, etc. just after the talk.

I prepared a simple application to shows you the Cypress magics, a simple authentication form.

Let's start!

# 01

Every testing tool has a CLI but Cypress has a UI too.
Here you can see the list of the tests, and we can choose which chrome version must host our tests.

Cypress comes with Electron installed but there is a big advantage in using a Chrome of ours: we can install extensions!
Let's see it in action!

You can see my simple application on the right and the test runner on the left. The test runner makes Cypress outstanding and gives your productivity a boost! It shows feedback for every Cypress command, every AJAX request made from the front-end application, and the result of all the assertions.
The test runner allows you to time-travel too, you can see a snapshot of the front-end application before and after every command. For example, we can see how the front-end application looked before and after the AJAX call. It's amazing!
We can even re-run the test.

As I told you, Cypress has a dedicated Chrome user, you can see at the top-right of the browser that I have installed the Redux and React dev tools.

Think about that for a moment: your testing browser can be your development browser too! The Chrome instance launched by Cypress is always opened and available!

How can we leverage that? Well, the first best practice is to never manually test your front-end application. We are used to coding the front-end, to test it manually and then to write an E2E test.
But if your testing browser stays always opened, leverage it! Apply a TDD outside-in approach, write your acceptance test in advance and then, code your front-end. You can check by yourself that it's what I did with this simple application. And even if you don't want to write your test in advance, keep the Cypress browser opened while you code and let it interact with the page instead of doing it manually. It's faster than you, trust me.

In one word: use Cypress as your main development tool, not just as a testing tool!

Come back to the test: isn't it slow? More than ten seconds for a simple authentication test, why is it so slow? Well:

- because it's an E2E test! An E2E test needs a working back-end, with a working database, it suffers from network slowness and it needs a lot of reliable data. As you can see in the code of the test, the first thing I do is to ask to the back-end to wipe the existing data and to add a new user, so the login flow is gonna work well
- there is long waiting for the AJAX call to happen

Starting from the latter, why do I wait five seconds? Well, because I noticed that 90% of the times the AJAX call takes just one second, some times it takes two seconds... and some times is even slower!
So, to avoid that the test fails because of a slow AJAX call, I added a long waiting! I'm sure that five seconds are enough...

Remember that one of most important the E2E testing best practices is: never make your test sleep! The test sleeps for five seconds, **five seconds**, while the AJAX call takes just one second, most of the times!
Let's see how can we improve that!

# 02

Cypress allows us to intercept an AJAX request, we just need to start the `cy.server` and specify the URL and the method of the AJAX call that the front-end will do. Then, we add it an alias and, in the middle of the test, we can replace the five seconds sleep with a `cy.wait`. We pass the AJAX alias to the cy.wait and Cypress will automatically wait for the AJAX call to happen. It does not matter how long it takes, Cypress will wait for it and freezes the test just for the right amount of time. No more five seconds threw away.
As you can see, the test now takes less than eight seconds! And we all know how much test speed is important for our time and for our pipelines...

The AJAX call is one of the deterministic events that an authentication form must pass through. You fill the form, it triggers an AJAX request and it gets a feedback. Always test your determinist events, that makes your test more robust.

Anyway: eight seconds for a simple authentication test is way too much:

- we need to test a lot of different fron-end paths
- if an authentication test takes eight seconds, how much time a cart checkout could take?
  We must decrease this time... But how?

Another really important best practice is: avoid writing full E2E tests! A full E2E test requires a working back-end with a working database with a lot of reliable data, all of that just to run a test! A real or mocked back-end is expensive to be written and to be maintained, let's consume some static fixtures instead of a real server!

# 03

Here you can see the result in terms of duration of the test. Less than two seconds for the same test. Obviously, this test is not a full E2E one, it's a UI integration test. I replaced the real server with a static fixture. Watch the test code, Cypress allows us not only to intercept and wait for the AJAX request but to stub it too!
Every time that the front-end will make the AJAX call, Cypress acts as a server and responds immediately with the content of the fixture. That get the test running so fast! The AJAX call takes zero time and we do not need to seed the data in advance anymore.

You could see the static fixtures that the front-end is going to receive here. To make the static fixtures reliable, you have to ask your back-ender to export them from his own tests or his PostMan configuration. But it allows us to run our test independently, no more server dependencies, no more network issues, no more slow tests. We have a centralized way to communicate with the back-enders and some blazing fast tests.

# 04

Now, what are the main goals of a test? The goals are:

- check that the subject under test works as expected
- tell us exactly where is the problem if the test fails

Well, take a look at this failing test: it tries to get the element containing the success feedback from the page but the element did not appear. Never mind, we need to open the dev tools, inspect the front-end under test, and we need to debug it. There is room for a plethora of things that did not happen and caused the final feedback to not show up, for example:

- does the login button trigger the action?
- does the AJAX request start?
- does the AJAX request has the right payloads?
- does the front-end parse correctly the AJAX response?
- has the element the right class?

There is room for too many errors, we need more fine feedbacks from our test.

# 05

In the next test, the test runner has a lot of green feedbacks. What have I added? I added an intermediate check with some assertions, I check that the AJAX request has the correct request payload. A wrong AJAX payload, both request and response, is one of the most common failure reasons for a front-end. That's why we need to keep it checked.
Doing so, our test speaks a lot more. if a test fails we have some more precise feedbacks, exclude some possibilities and we are driven more precisely to the error.

# 06

We need to do the same in our E2E test. Here the server is not stubbed, so we must check the response payload and the response status too. Again, it's really important because the test not only has to test the front-end, but it must help us in case of failure too! And checking the contract between the front-end and the back-end is really important.

# 07

The same principle can be applied to DOM elements too, the more assertions you add to the test, the more the test helps you identifying what's wrong.

# 08

One more big improvement to the test. Think about how the user consumes your front-end: it consumes it through text contents. The user fills an authentication form looking the input field with a placeholder or a label that tells him that it's the input field for the username. He or she does the same for the password, the login button, etc. The user does not care about selectors, the "username" class is not helpful for the user.

Remember: the more your test consumes the front-end the same ways the consumer does, the more you are confident that your front-end works. Ad much as you can, you do not have to test your front-end as a programmer, test it as a user!

This approach has one more big advantage, consider a failing test: if you consume your application through selectors and an interacting with an element fails, you have three possible issues:

- the element has not the attribute
- the element has the attribute but its value is not aligned with the test one
- the element does not exist, or it's invisible
  So, you need to launch the test, pause it when it fails, and inspect the DOM.

Instead, if you consume the front-end through contents, most of the times you just need a screenshot of your front-end to understand what's wrong. And guess? Cypress takes a screenshot automatically when a test fails!!

I know that's not always so easy, but remember to consume your app:

- through contents as a first choice
- through aria-attributes as a second choice
- through test-id attributes as the last choice
  And never, never, consume is through class-based or id-based selectors! Because if every attribute as a role, classes are for CSS, ids are for JavaScript... They can change for purposes that are not related to testing and you can face a false positive, a failing test while the app works.

Take a look at the test, I now consume front-end elements through contents instead of selectors.

# 09

The next secret is decreasing the number of test failures is to import some constants from the front-end app. Nothing changes from a testing perspective, except that I import some constants from the front-end app. Nothing changes from a testing perspective, except that I import some constants from the front-end application. Doing so, we minimize our chance of getting false positives. If the UI designer comes and tell us to change some contents of the page, the front-end will not stop working, but the test will do!
False negatives are one of the reasons why developers hate E2E tests, this kind of tests are brittle by default, you need to do whatever you can to reduce false negatives.

# 10-1

UI integration tests are great even because you can test all the states of the front-end easily. Here I test easily how the front-end behaves with a not-authenticated status. You just need to tell cypress the status you want from the stubbed request. Et voilà, we tested one more front-end path in a while, without the need for strange conditions coded directly into the front-end.

# 10-2

The same is for all the error paths.

# 11

I wanna show you one more Cypress utility, clock management. The front-end shows the user feedback if the AJAX request takes long. It shows a "be patient" string to the user if the AJAX request lasts more than three seconds. Obviously, testing this path is long but Cypress allows us to control the browser clock. See the test code:

- I start the `cy.clock` object
- I add an artificial delay to the stubbed request
- I move forward the browser clock by 3 seconds with `cy.tick`

As you can see, the test lasts more less like a standard test. And take a look at the front-end states before and after the 3-seconds tick. Clock management is another amazing Cypress utility.

# 12

Last but not least: we'are testing the authentication flow and we need to interact with the UI. But in a real application, every test needs to be authenticated and sessions are not shared between the tests. The first choice could be to authenticating through the UI before every test but, even is Cypress makes it fast, reaching a state through the UI is not a great choice.

You should instead consider exporting some shortcuts directly from the front-end. So you can get the test authenticated in a while. Consuming some front-end shortcuts allows you to:

- avoid duplicating flow paths: the front-end code knows how to get authenticated, do not put this logic into the test too. You could do it to speed up your test but you end up with two different logic to maintain
- make your test faster and reaching the starting pèoint of the test in a while

Take a look at the code of the test, you could put this code before every test to get them authenticated. To do so you can add a condition in your front-end code, "if window.cypress is defined, then add the shortcuts". Or you can use a webpack plugin to remove the shortcut before the production build. Choose your way but front-end shortcuts will save your testing life.

That's all with the code, two common questions that I hear usually :

- does Cypress support only Chrome? Yes! They're working on cross-browser support but, until now, only Chrome is supported. But remember that cross-browser support is more important for visual regression testing and there are a lot of existing services that do so. Applitools, Percy, Chromatic, etc. And they can be integrated with Cypress too
- is Cypress free? Yes, it's free and open-source, you have to pay only for advanced stuff like test video hosting, etc.

Is it all about front-end testing? No, Cypress simplify the hardest stuff with E2E testing but you need some more tools to become a testing winner, I suggest you deepen Cypress and Storybook too.

I and Jaga Santagostino are preparing a two-day workshop about the whole spectrum of front-end testing, drop us a line if you wanna know more.

I'm working on a UI Best Practices book on Github because there is not a central point where you can learn all the best practices about the topic.

I recommend some online courses and some online articles to deepen the subject.

I actually work for Conio, a bitcoin startup based in Milan, and we're looking for a front-end developer if you're interested in joining the team...

Thanks to a lot of people for the early feedbacks and thank you too for attending my talk.
The slides are available at my slides.com profile and the repository with the simple app and the tests I've shown you today is on GitHub.
Thanks to the organizers and the sponsors, feel free to stop me to chat about E2E testing and Cypress.
