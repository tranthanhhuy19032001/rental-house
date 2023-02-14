// Constructor function
function Validator(options) {
    function getParent(inputElement, selector) {
        while (inputElement.parentElement) {
            if (inputElement.parentElement.matches(selector)) {
                return inputElement.parentElement;
            }
            inputElement = inputElement.parentElement;
        }
    }

    selectorRules = {};

    //Hàm thực hiện validate
    function validate(inputElement, rule) {
        //value: inputElement.value
        //test function : rule.test
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage = rule.test(inputElement.value);

        //Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        //Lặp qua từng rule và kiểm tra, nếu có lỗi thì dừng kiểm tra
        for (var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'));
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }

            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerHTML = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerHTML = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }
        return !errorMessage;
    }

    var formElement = document.querySelector(options.form);

    if (formElement) {
        //Khi submit form
        formElement.onsubmit = function (event) {
            event.preventDefault();

            var isFormValid = true;

            //Lặp qua từng rule và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);

                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                return false;
            } else {
                formElement.submit();
            }
            // //Submit với JS
            // if (typeof options.onSubmit === 'function') {
            //     var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
            //     var formValues = Array.from(enableInputs).reduce(function (values, input) {
            //         switch (input.type) {
            //             case 'radio':
            //                 values[input.name] = formElement.querySelector(
            //                     'input[name="' + input.name + '"]:checked',
            //                 ).value;
            //                 break;
            //             case 'checkbox':
            //                 if (!input.matches(':checked')) {
            //                     values[input.name] = '';
            //                     return values;
            //                 }
            //                 if (!Array.isArray(values[input.name])) {
            //                     values[input.name] = [];
            //                 }
            //                 values[input.name].push(input.value);
            //                 break;
            //             case 'file':
            //                 values[input.name] = input.files;
            //                 break;
            //             default:
            //                 values[input.name] = input.value;
            //         }
            //         return values;
            //     }, {});
            //     formElement.submit();
            //     options.onSubmit(formValues);
            // }
            // Submit mặc định
            // else {
            // formElement.submit();
            // }
            // }
        };

        //Lặp qua các rules và xử lý(lắng nghe sự kiện blur, input, ...)
        options.rules.forEach(function (rule) {
            //Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function (inputElement) {
                //Xử lý blue
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                };

                //Xử lý khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(
                        options.errorSelector,
                    );
                    errorElement.innerHTML = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                };
            });
        });
    }
}

//Define rules
//Nguyen tac cua rules
//1. Khi có lỗi thì trả ra message lỗi
//2. Khi hợp lệ không trả ra gì cả
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'Vui lòng nhập vào trường này!';
        },
    };
};

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Giá trị nhập vào không chính xác';
        },
    };
};

Validator.isMinLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim().length >= min ? undefined : message || 'Giá trị nhập vào không chính xác';
        },
    };
};

Validator.isConfirmPassword = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        },
    };
};
