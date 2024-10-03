import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from  '../store/store'
import styles from '../styles/Username.module.css';
import { generateOTP, verifyOTP } from '../helper/helper';
import { useNavigate } from 'react-router-dom'

export default function RecoveryKZ() {

    const { username } = useAuthStore(state => state.auth);
    const [OTP, setOTP] = useState();
    const navigate = useNavigate()

    useEffect(() => {
        generateOTP(username).then((OTP) => {
            console.log(OTP)
            if(OTP) return toast.success('OTP has been send to your email!');
            return toast.error('Problem while generating OTP!')
        })
    }, [username]);

    async function onSubmit(e){
        e.preventDefault();
        try {
            let { status } = await verifyOTP({ username, code : OTP })
            if(status === 201){
                toast.success('Verify Successfully!')
                return navigate('/reset')
            }
        } catch (error) {
            return toast.error('Wront OTP! Check email again!')
        }
    }

    // handler of resend OTP
    function resendOTP(){

        let sentPromise = generateOTP(username);

        toast.promise(sentPromise ,
            {
                loading: 'Sending...',
                success: <b>OTP has been send to your email!</b>,
                error: <b>Could not Send it!</b>,
            }
        );

        sentPromise.then((OTP) => {
            console.log(OTP)
        });

    }

    return (
        <div className="container mx-auto">

            <Toaster position='top-center' reverseOrder={false}></Toaster>

            <div className='flex justify-center items-center h-screen'style={{width: "1300px", height: "800px"}}>
                <div className={styles.glass}>

                    <div className="title flex flex-col items-center">
                        <h4 className='text-5xl font-bold'>Құпиясөзді қайта құрастыру</h4>
                        <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                Аккаунтты қайтару үшін кодты енгізіңіз
            </span>
                    </div>

                    <form className='pt-20' onSubmit={onSubmit}>

                        <div className="textbox flex flex-col items-center gap-6">

                            <div className="input text-center">
                    <span className='py-4 text-sm text-left text-gray-500'>
                     Электрондық поштаңызға жіберілген 6 таңбалы кодты енгізіңіз
                    </span>
                                <input onChange={(e) => setOTP(e.target.value) } className={styles.textbox} type="text" placeholder='OTP' />
                            </div>

                            <button className={styles.btn} type='submit'>Сброс</button>
                        </div>
                    </form>

                    <div className="text-center py-4">
                        <span className='text-gray-500'>Код келмеді ме? <button onClick={resendOTP} className='text-red-500'>Жіберу</button></span>
                    </div>

                </div>
            </div>
        </div>
    )
}
