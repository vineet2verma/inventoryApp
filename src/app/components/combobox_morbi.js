'use client'

import { useState, useEffect } from 'react'
import { Combobox } from '@headlessui/react'

export default function DesignComboBoxMorbi({ formData, setFormData, setsizearray }) {
    const [query, setQuery] = useState('')
    const [options, setOptions] = useState([])
    const [selected, setSelected] = useState('')
    const [data1, setData1] = useState([])

    function forselection(e) {
        const coname = data1.filter((item) => (item.designname === e))[0].coname
        const sizearray = Array.from(new Set(data1.filter((item) => (item.designname === e)).map((item) => item.size)))
        setsizearray(sizearray)
        setFormData({ ...formData, designname: e, tilename: e, coname: coname, })
        setSelected(e)
    }
    // Debounce search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim()) {
                fetch(`/api/searchdesign?query=${encodeURIComponent(query)}`)
                    .then((res) => res.json())
                    .then((data) => {
                        setData1(data.data)
                        setOptions(data.data.map(e => e.designname) || [])
                        // console.log("data", data.data)
                    })
                    .catch(() => setOptions([]))
            } else {
                setOptions([])
            }
        }, 1200) // debounce delay

        return () => clearTimeout(delayDebounce)
    }, [query])

    function handleChange(e) {
        // console.log("val log from combo", ftd)
        setQuery(e.target.value)
    }
    return (
        <div className="w-full">
            <Combobox value={selected} onChange={forselection} name='designname'>
                <div className="relative">
                    <Combobox.Input
                        name='designname'
                        className="w-full border rounded p-2 "
                        placeholder="Search design..."
                        onChange={handleChange}
                        displayValue={(item) => item}
                    />
                    {options.length > 0 && (
                        <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white">
                            {options.map((item, i) => (
                                <Combobox.Option
                                    key={i}
                                    value={item}
                                    className={({ active }) =>
                                        `cursor-pointer select-none p-2 ${active ? 'bg-blue-500 text-white' : 'text-black'
                                        }`
                                    }
                                >
                                    {item}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    )}
                </div>
            </Combobox>
        </div>
    )
}
