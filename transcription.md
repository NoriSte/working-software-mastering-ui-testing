# 00

Hi guys
The video shows you some tests of mine running with Cypress.
Today, I'm gonna talking to you about Cypress and end-to-end testing best practices.
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
We can even re-run the tests and.

As I told you, Cypress has a dedicated Chrome user, you can see at the top-right of the browser that I have installed the Redux and React dev tools.

Think about that for a moment: your testing browser can be your development browser too! The Chrome instance launched by Cypress is always opened and available!

How can we leverage that? Well, the first best practice is to never manually test your front-end application. We are used to coding the front-end, to test it manually and then to write an E2E test.
But if your testing browser stays always opened, leverage it! Apply a TDD outside-in approach, write your acceptance test in advance and then, code your front-end. You can check by yourself that it's what I did with this simple application. And even if you don't want to write your test in advance, keep the Cypress browser opened while you code and let it interact with the page. It's faster than you while you interact manually, trust me.

In one word: use Cypress as your main development tool, not just as a testing tool!

Come back to the test: isn't it slow? More than ten seconds for a simple authentication test, why is it so slow? Well:
- because it's an E2E test! An E2E test needs a working back-end, with a working database, it suffers from network slowness and it needs a lot of reliable data. As you can see in the code of the test, the first thing I do is to ask to the back-end to wipe the existing data and to add a new user, so the login flow is gonna work well
- there is long waiting for the AJAX call to happen

Starting from the latter, why I wait five seconds? Well, because I noticed that 90% of the times the AJAX call takes just one second, some times it takes two seconds... and some times is even slower!
So, to avoid that the test fails because of a slow AJAX call, I added a long waiting! I'm sure that five seconds are enough...

Remember that one of the E2E testing best practices is: never make your test sleep! The test sleeps for five seconds, **five seconds**, while the AJAX call takes just one second, most of the times!
Let's see how can we improve that!

# 02

Cypress allows us to intercept an AJAX request, we just need to start the `cy.server` and specify the URL and the method of the AJAX call that the front-end will do. Then, we add it an alias and, in the middle of the test, we can replace the five seconds sleep with a `cy.wait`. We pass the AJAX alias to the cy.wait and Cypress will automatically wait for the AJAX call to happen. It does not matter how long it takes, Cypress will wait for it and freezes the test just for the right amount of time. No more five seconds threw away.
As you can see, the test now takes less than eight seconds! And we all know how much test speed is important for our time and for our pipelines...

Anyway: eight seconds for a simple authentication test is way too much:
- we need to test a lot of different fron-end paths
- if an authentication test takes eight seconds, how much time a cart checkout could take?
We must decrease this time... But how?

Another really important best practice is: avoid writing full E2E tests! A full E2E test requires a working back-end with a working database with a lot of reliable data, all of that just to run a test! A real or mocked back-end is slow expensive to be written and to be maintained, let's consume some static fixtures instead of a real server!

# 03

Here you can see the result in terms of duration of the test. Less than two seconds for the same test. Obviously, this test is not a full E2E one, it's a UI integration test. I replaced the real server with a static fixture. Watch the test code, Cypress allows us not only to intercept and wait for the AJAX request, but to stub it too!
Everytime that the front-end will make the AJAX call, Cypress acts as a server and responds immediately with the content of the fixture. That get the test running so fast! The AJAX call takes zero time and we do not need to seed the data in advance anymore.
