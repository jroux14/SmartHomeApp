import {
    trigger,
    style,
    animate,
    transition,
    query,
    sequence,
    stagger
    // ...
} from '@angular/animations';

export const DropDownAnimation = trigger('dropDown', [
    transition(':enter', [
        style({
            width: 0,
            overflow: 'hidden'
        }),
        query('.loginBtn', [
            style({
                opacity: 0
            })
        ]),
        query('.dropdown-content', [
            style({
                opacity: 0
            })
        ]),
        sequence([
            animate('500ms ease', style({ width: '*' })),
            query('.loginBtn, .dropdown-content', [
                stagger(50, [
                    animate(
                        '500ms ease',
                        style({ opacity: 1, transform: 'none' })
                    )
                ])
            ])
        ])
    ]),
    transition(':leave', [
        style({ width: '*', overflow: "hidden" }),
        query('.loginBtn', [style({ opacity: 1, transform: 'none' })]),
        query('.dropdown-content', [style({ opacity: 1, transform: 'none' })]),
        sequence([
            query(".dropdown-content, .loginBtn", [
                stagger(50, [
                    animate(
                        "400ms ease",
                        style({ opacity: 0, transform: "none" })
                    )
                ])
            ]),
            animate("200ms", style({ width: 0 })),
        ])
    ])
])
