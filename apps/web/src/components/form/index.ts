import { createFormHook } from "@tanstack/react-form";
// import { Checkbox, ChipGroup, RadioCards, Switch, YesNo } from "@/components/form/choices";
import {
    DateField,
    // FieldError,
    // LinesTextArea,
    // MonthField,
    // MonthInput,
    // NumberInput,
    // Select,
    // SelectField,
    // TextArea,
    // TextAreaField,
    // TextField,
    TextField,
} from "@/components/form/fields";
import { SaveBar } from "@/components/form/save-bar";
// import { TagInput } from "@/components/form/tag-input";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        // Checkbox,
        // ChipGroup,
        DateField,
        // FieldError,
        // LinesTextArea,
        // MonthField,
        // MonthInput,
        // NumberInput,
        // RadioCards,
        // Select,
        // SelectField,
        // Switch,
        // TagInput,
        // TextArea,
        // TextAreaField,
        TextField,
        // YesNo,
    },
    formComponents: {
        SaveBar,
    },
});
