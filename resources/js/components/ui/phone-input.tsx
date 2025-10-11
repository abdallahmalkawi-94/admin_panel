import * as React from 'react';
import PhoneInputLib, { type Country } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { cn } from '@/lib/utils';

interface PhoneInputProps {
    value: string;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    className?: string;
    id?: string;
    defaultCountry?: Country;
    'aria-invalid'?: boolean;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    (
        {
            value,
            onChange,
            placeholder = 'Enter phone number',
            className,
            id,
            defaultCountry,
            'aria-invalid': ariaInvalid,
        },
        _ref,
    ) => {
        return (
            <PhoneInputLib
                international
                countryCallingCodeEditable={false}
                defaultCountry={defaultCountry}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                id={id}
                className={cn('phone-input-wrapper', className)}
                numberInputProps={{
                    className: cn(
                        'PhoneInputInput',
                        ariaInvalid &&
                            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                    ),
                }}
            />
        );
    },
);

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
