# from selenium import webBrowser
# from selenium.common import exceptions
# from selenium.webBrowser.common.keys import Keys
# from selenium.webBrowser.common.by import By
# 
# browser = webBrowser.Firefox()
# 
# browser.get('http://www.P2P.am')
# # assert 'P2P' in browser.title
# try:
#     elem = browser.find_element(By.CLASS_NAME, 'nav')
# except exceptions:
#     elem.send_keys(Keys.RETURN)
# 
# browser.quit()
from time import sleep
from selenium.common import exceptions
from selenium.webdriver import DesiredCapabilities
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium import webdriver

username_password = ["UsernameExample", "PasswordExample"]
URL = 'http://localhost:3000/'
TITLE = 'P2P File Sharing'
LOGIN = ('#!/login', '#!/home', '#!/registration', '#!/changePassword', '#!/addDevice')  # and e.t.c.
DELAY = 30
PASSWORDS = ["PasswordExample",
             '10000000000000001',
             "Password",
             'True',
             'None',
             'False',
             "PasswordExample"
             ]


class P2PTest:
    """
    P2P File Sharing Web Application
    Test Class
    """

    def __init__(self):
        """
        CONSTRUCTOR of P2PTest class
        - Creates class member object(tuple) of browser instances
        - And running main function which runs all remained tests
        """
        self.Browser = self.create_and_connect()
        self.run_tests()

    def create_and_connect(self):
        """
        - Makes an instance of Web Browsers class
        object with specified options
        - Connects to the URL specified 
        - and returns Browser objects
        :return: webdriver.Firefox , webdriver.Chrome
        :rtype: Tuple
        """
        FirefoxBrowser = webdriver.Firefox(firefox_profile=self.setup_firefox_profile()[0],
                                           capabilities=self.setup_firefox_profile()[1])
        FirefoxBrowser.get(URL)
        ChromeBrowser = webdriver.Chrome(chrome_options=self.setup_chrome_options())
        ChromeBrowser.get(URL)
        return ChromeBrowser, FirefoxBrowser

    def setup_firefox_profile(self):
        """
        :return: object: FirefoxProfile and DesiredCapabilities
        :rtype: Tuple
        """
        firefox_profile = webdriver.FirefoxProfile()
        firefox_profile.set_preference("general.useragent.override",
                                       "Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0")
        firefox_profile.set_preference('media.navigator.permission.disabled', True)
        firefox_profile.update_preferences()
        firefox_capabilities = DesiredCapabilities.FIREFOX
        firefox_capabilities['marionette'] = True
        firefox_capabilities['binary'] = '/opt/firefox/firefox-bin'
        return firefox_profile, firefox_capabilities

    def setup_chrome_options(self):
        """
        Tools to disable web notifications
        :return:
        """
        chrome_options = webdriver.ChromeOptions()
        prefs = {"profile.default_content_setting_values.notifications": 2}
        chrome_options.add_experimental_option("prefs", prefs)
        chrome_options.add_argument("--enable-save-password-bubble=false")
        return chrome_options

    def run_tests(self):
        """
        Initiates the test cases
        :rtype: object
        """
        for browser in self.Browser:
            print('\n********' + browser.name.upper() + '\n********')
            self.registration_page_test(browser)
            self.login_page_test(browser)
            self.home_page_test(browser)
            self.change_password_test(browser)
        sleep(2)
        for browser in self.Browser:
            browser.close()
            print(browser.name.upper() + " is closed")

    def registration_page_test(self, ditarkich):
        """
        :return:
        """
        try:
            # WebDriverWait(ditarkich, DELAY) \
            #     .until(EC.presence_of_element_located((By.ID, "serverError")))

            ditarkich.find_element_by_link_text("Registration").click()
            sleep(1)
            for password in PASSWORDS:
                username = ditarkich.find_element_by_xpath("//input[@name='userName']")
                passwd = ditarkich.find_element_by_xpath("//input[@name='password']")
                confirm_password = ditarkich.find_element_by_xpath("//input[@name='confirmPassword']")
                submit = ditarkich.find_element_by_xpath("//input[@type='submit' and @value='Register']")

                ActionChains(ditarkich).click(username)\
                    .key_down(Keys.CONTROL)\
                    .send_keys("a")\
                    .key_up(Keys.CONTROL)\
                    .send_keys(username_password[0])\
                    .perform()

                ActionChains(ditarkich).click(passwd)\
                    .key_down(Keys.CONTROL)\
                    .send_keys("a")\
                    .key_up(Keys.CONTROL)\
                    .send_keys(password)\
                    .perform()

                ActionChains(ditarkich).click(confirm_password)\
                    .key_down(Keys.CONTROL)\
                    .send_keys("a")\
                    .key_up(Keys.CONTROL)\
                    .send_keys(password)\
                    .perform()

                submit.click()
                sleep(2)

                if ditarkich.current_url.find(LOGIN[2]) != -1:
                    print("\nRegistration Test\nUsername: " + username_password[0] +
                          "\nPassword: " + password + "".ljust(40, '-') + "PASS")
                    sleep(2)
                    # self.return_to_home(ditarkich)  ### uncomment for release
                else:
                    print("\nRegistration Test\nUsername: " + username_password[0] +
                          "\nPassword: " + password + "".ljust(40, '-') + "FAIL")
        except exceptions.TimeoutException:
            print("Loading Took Too Much Time!")
            exit(-1)
        except exceptions.NoSuchElementException:
            print("Registration Page Not Loaded Properly!!!")
            exit(-1)
        except Exception:
            print("Something Went Wrong: " + LOGIN[2])

        self.return_to_home(ditarkich)

    def login_page_test(self, ditarkich):
        """
        :return:
        """

        try:
            # WebDriverWait(ditarkich, DELAY) \
            #     .until(EC.presence_of_element_located((By.ID, "serverError")))

            # pre = browser.find_element_by_css_selector(".ng-binding")

            if ditarkich.current_url == URL + LOGIN[0]:
                print("URL " + LOGIN[0] + " Test".ljust(40, '-') + "PASS")
            else:
                print("URL " + LOGIN[0] + " Test".ljust(40, '-') + "FAIL")

            if ditarkich.title != TITLE:
                print("Title Name Test".ljust(40, '-') + "FAIL")
            else:
                print("Title Name Test".ljust(40, '-') + "PASS")

            for password in PASSWORDS:
                username = ditarkich.find_element_by_name("userName")

                passwd = ditarkich.find_element_by_name("password")
                submit = ditarkich.find_element_by_xpath("//input[@type='submit' and @value='Login']")
                ActionChains(ditarkich).click(username)\
                    .key_down(Keys.CONTROL)\
                    .send_keys("a")\
                    .key_up(Keys.CONTROL)\
                    .send_keys(username_password[0])\
                    .perform()

                ActionChains(ditarkich).click(passwd)\
                    .key_down(Keys.CONTROL)\
                    .send_keys("a")\
                    .key_up(Keys.CONTROL)\
                    .send_keys(password)\
                    .perform()

                submit.click()
                sleep(2)

                if ditarkich.current_url.find(LOGIN[1]) != -1:
                    print("\nLog in Test\nUsername: " + username_password[0] +
                          "\nPassword: " + password + "".ljust(40, '-') + "PASS")
                    sleep(1)
                    ditarkich.back()
                else:
                    print("\nLog in Test\nUsername: " + username_password[0] +
                          "\nPassword: " + password + "".ljust(40, '-') + "FAIL")

        except exceptions.TimeoutException:
            print("Loading Took Too Much Time!")
            exit(-1)

        except exceptions.NoSuchElementException:
            print("Login Page Not Loaded Correctly!!!")
            exit(-1)

        except Exception:
            print("Something Went Wrong: " + LOGIN[1])

    def home_page_test(self, ditarkich):
        try:
            ditarkich.get(URL+LOGIN[1])
            sleep(1)

            if ditarkich.current_url == URL + LOGIN[1]:
                print("Home Page Test".ljust(40, '-') + "FAIL")
                print("\n*****System not logged in yet*****\n")
            else:
                print("Home Page Test".ljust(40, '-') + "PASS")

            ditarkich.find_element_by_xpath('//div[@class="float-left ng-scope"')
            ditarkich.find_element_by_link_text('Change Password').click()

        except exceptions.NoSuchElementException:
            print('Home Page Visibility Working Directory Tree Test'.ljust(40, '-') + 'FAIL')

        except Exception:
            print("Something Went Wrong: " + LOGIN[1])

    def change_password_test(self, ditarkich):
        ditarkich.get(URL + LOGIN[3])
        if ditarkich.current_url != URL + LOGIN[0]:
            try:
                WebDriverWait(ditarkich, DELAY) \
                    .until(EC.presence_of_element_located((By.ID, "serverError")))

                for password in PASSWORDS:

                    old_password = ditarkich.find_element_by_name("oldPAssword")
                    new_password = ditarkich.find_element_by_name("newPassword")
                    confirm_password = ditarkich.find_element_by_xpath("//input[@name='confirmPassword']")
                    submit = ditarkich.find_element_by_xpath("//input[@type='submit' and @value='Submit new password']")

                    ActionChains(ditarkich).click(old_password) \
                        .key_down(Keys.CONTROL) \
                        .send_keys("a") \
                        .key_up(Keys.CONTROL) \
                        .send_keys(username_password[1]) \
                        .perform()

                    username_password[1] = password

                    ActionChains(ditarkich).click(new_password) \
                        .key_down(Keys.CONTROL) \
                        .send_keys("a") \
                        .key_up(Keys.CONTROL) \
                        .send_keys(password) \
                        .perform()

                    ActionChains(ditarkich).click(confirm_password) \
                        .key_down(Keys.CONTROL) \
                        .send_keys("a") \
                        .key_up(Keys.CONTROL) \
                        .send_keys(username_password[1]) \
                        .perform()

                    submit.click()
                    sleep(2)

                    if ditarkich.current_url.find(LOGIN[1]) != -1:
                        print("\nLog in Test\nUsername: " + username_password[0] +
                              "\nPassword: " + password + "".ljust(40, '-') + "PASS")
                        sleep(1)
                        ditarkich.back()
                    else:
                        print("\nLog in Test\nUsername: " + username_password[0] +
                              "\nPassword: " + password + "".ljust(40, '-') + "FAIL")

            except exceptions.TimeoutException:
                print("Loading Took Too Much Time!")
                exit(-1)

            except exceptions.NoSuchElementException:
                print("Login Page Not Loaded Correctly!!!")
                exit(-1)

            except Exception:
                print("Something Went Wrong: " + LOGIN[1])
        else:
            print("Password Changing Page Test".ljust(40, '-') + "FAIL")
            print("\n*****System not logged in yet*****\n")

    def return_to_home(self, ditarkich):
        """
        Returns page to P2P website homepage
        :return: Gets initial URL page
        :rtype: None
        """
        ditarkich.get(URL)


if __name__ == '__main__':
    P2PTest()
